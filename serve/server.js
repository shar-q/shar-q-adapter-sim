var express = require('express')
var log4js = require('log4js')
var logger = log4js.getLogger()
var fs = require('fs')
var jose = require('node-jose')
var config = require('../config/config.js')



module.exports.runServer = function (td) {
  logger.info('Running adapter simulator on port ' + config.adapter.port)
  logger.info('Loading TD: ' + td)
  logger.info('Signituring is set: ' + config.adapter.sign)
  if (config.adapter.sign) {
    logger.info('Private key typ: ' + config.adapter.privateKey.type)
    logger.info('Private key: ' + config.adapter.privateKey.key)
  }
  logger.info('Encryption is set: ' + config.adapter.encrypt)

  logger.debug('... Reading thing description')
  var rawdata = fs.readFileSync(td)
  var object = JSON.parse(rawdata)

  if (object == null || object === {} || object === '') {
    logger.error('I had a problem to read thing description!')
  } else {
    logger.debug('... Thing description loaded!')
    var app = express()
    logger.debug('... Instantiateing keystore!')
    var keystore = jose.JWK.createKeyStore()

    logger.debug('... Adding key to keystore!')
    keystore.add(
      config.adapter.privateKey.key,
      config.adapter.privateKey.type).then (function(privateKey) {


        // Build the expressjs middlewares

        app.use(function (req, res, next) {
          logger.debug(req)
          logger.debug('Received request')
          next()
        })

        app.get('/agent/objects/:oid/properties/:pid', function (req, res, next) {
          logger.debug('PID: ' + req.params.pid)
          logger.debug('OID: ' + req.params.oid)
          var rawResponse = ''
          object.properties.forEach(function (element) {
            if (element.pid === req.params.pid) {
              rawResponse = element.read_link.response
            }
          })
          res.set({'Content-Type': 'application/json'})
          res.locals.rawResponse = rawResponse
          next()
        }) // End of get


        //Signiture middleware
        app.use(function(req, res, next){
          if (config.adapter.sign) {
            logger.debug('Performing signing ... ')
            logger.debug('Content being signed: ' + JSON.stringify( res.locals.rawResponse))
            logger.debug('Private key: ' + JSON.stringify(privateKey))
            logger.debug('... signing')
            jose.JWS.createSign({protect: false }, privateKey)
              .update(JSON.stringify(res.locals.rawResponse)).final().then(function(signedResponse) {
                  // {result} is a JSON object -- JWS using the JSON General Serialization
                  logger.debug('Signed content: ' + JSON.stringify(signedResponse))
                  res.locals.signedResponse = signedResponse
                  res.set({'Content-Type': 'application/jose+json'})
                  next()
                }) // End of signituring

          } else {
            logger.debug('... signing skipped')
            next()
          }
        })// End of singiture middleware


        // Encryption middleware
        app.use(function(req, res, next){
          if (config.adapter.encrypt) { // Encryption
            logger.debug('Performing encryption ...');
            var encryptContent = ''
            if (config.adapter.sign) {
              encryptContent = res.locals.signedResponse
            } else {
              encryptContent = res.locals.rawResponse
            }
            pemPublicKey = getPublicKeyofOID('') //get requesters public key - now hardcoded;
            keystore.add(pemPublicKey.key, pemPublicKey.type).
              then (function(publicKey) {
                logger.debug('... public key created: ' + JSON.stringify(publicKey))
                logger.debug('... encryting')
                jose.JWE.createEncrypt(
                  {fields:{alg: 'RSA1_5',enc:'A128CBC-HS256'}},publicKey).
                  update(JSON.stringify(encryptContent)).final().then(function(encryptedResponse){
                    logger.debug('Encrypted content: ' + JSON.stringify(encryptedResponse))
                    res.locals.encryptedResponse =  encryptedResponse
                    res.set({'Content-Type': 'application/jose+json'})
                    next()
                  })
              }) // End of encryption

          } else {
              logger.debug('... encryption skipped')
              next()
          }
        })

        // Building response middleware
        app.use(function(req, res, next){
          var response = ''

          logger.debug('Finalization of the middleware')
          if (config.adapter.encrypt) {
            response =  res.locals.encryptedResponse;
          } else if (config.adapter.sign) {
            response = res.locals.signedResponse;
          } else {
            response = res.locals.rawResponse;
          }
          res.send(response)
        })

        logger.debug('... Running express service!')
        app.listen(config.adapter.port)
      }) //End of add key premis
  } // End of object no null
}

function getPublicKeyofOID(oid){
  return config.service.publicKey;
}

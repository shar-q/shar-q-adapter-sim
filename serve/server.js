var express = require('express')
var log4js = require('log4js')
var logger = log4js.getLogger()
var fs = require('fs')

module.exports.runServer = function (port, td, isSigning, isEncrypt) {
  logger.info('Running adapter simulator on port ' + port)
  logger.info('Loading TD: ' + td)

  var rawdata = fs.readFileSync(td)
  var object = JSON.parse(rawdata)

  if (object == null || object === {} || object === '') {
    logger.error('I had a problem to read thing description!')
  } else {
    var app = express()
    // app.get('/api/objects/:oid/properties/:pid', function (req, res) {
    //   var responseValue = ''
    //   object.properties.forEach(function (element) {
    //     if (element === req.pid) {
    //       responseValue = element.read_link.response
    //     }
    //   })
    //   res.send(responseValue)
    // })
    app.use(function (req, res, next) {
      logger.debug('Received request')
      next()
    })
    app.get('/api/objects/:oid/properties/:pid', function (req, res, next) {
      logger.debug('PID: ' + req.params.pid)
      logger.debug('OID: ' + req.params.oid)
      var responseValue = ''
      object.properties.forEach(function (element) {
        if (element.pid === req.params.pid) {
          responseValue = element.read_link.response
        }
      })
      res.type('application/json')
      res.send(responseValue)
      next()
    })
    app.use(function (req, res, next) {
      if (isSigning) {
        logger.debug('Signing')
      }
      next()
    })
    app.use(function (req, res, next) {
      if (isEncrypt) {
        logger.debug('Encrypt')
      }
    })
    app.listen(port)
  }
}

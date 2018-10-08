var request = require('request')
var fs = require('fs')
var helper_io = require('../helpers/io.js')
var log4js = require('log4js')
var logger = log4js.getLogger()

//Function performing the registration of the thing description
exports.sendRegistration = function (adid, adid_password, tdFile, storageDir){
  var rawTD = fs.readFileSync(tdFile)
  var objectTD = JSON.parse(rawTD)

  if (objectTD == null || objectTD === {} || objectTD ==='') {
    logger.error('I had a problem to read thing description!')
  } else {

    var options = { method: 'POST',
      url: 'http://localhost:8181/api/agents/' + adid + '/objects',
      headers:
       {
         Authorization: 'Basic ' + Buffer.from(adid + ':' + adid_password).toString('base64'),
         'Content-Type': 'application/json' },
      body:
        {
          adid: adid,
          thingDescriptions: [objectTD]},
      json: true
    };

    request(options, function (error, response, body) {
      if (error) {
        logger.error(error.stack + ' - ' + error.message )
      } else {
        logger.debug(body)
        helper_io.serializeOidSecretes(body.message, storageDir)
      }

    });
  }
}

var login = require('./login/login.js')
var config = require('./config/config.js')
var register = require('./register/register.js')
var get = require('./get/get.js')
var server = require('./serve/server')
var log4js = require('log4js')
var minimist = require('minimist')
var logger = log4js.getLogger()
logger.level = 'debug'

var args = minimist(process.argv.slice(2), {
  alias: {
    i: 'input',
    p: 'property',
    o: 'objectid' }
})

if (args._[0] === 'login') {
  logger.info('Executing login in Gateway API')

  var host = config.gateway.host
  var port = config.gateway.port-i 

  if ( args.input == null) {
    var adid = config.gateway.adid
    var adid_password = config.gateway.adid_password
    // login.loginInGatewayAPI('localhost', '8181', 'e354cb68-4d79-4d4b-a822-1839e5436b64', 'test')
    login.loginAdapterInGatewayAPI(host, port, adid, adid_password)
  } else {
    login.loginDeviceInGatewayAPI(host, port, args.input)
  }
} else if (args._[0] === 'register') {
  // Registering thing descriptions
  var td = args.input
  var adid = config.gateway.adid
  var adid_password = config.gateway.adid_password
  if (td != null && td !== '') {
    logger.info('Registering ThingDescription: ' + td)
    register.sendRegistration(adid, adid_password, td, config.adapter.storage)
  } else {
    logger.error('Missing thing description to be registered')
  }
} else if (args._[0] === 'read') {
  // Reading property from thing description
  var property = args.property
  var oid = args.objectid
  if (property == null || property !== '' || oid == null || oid !== '') {
    logger.error('Missing property or oid to be read')
  } else {
    logger.info('Read property: ' + oid + '.' + property)
  }
} else if (args._[0] === 'serve') {
  // Serving the the thing description
  td = args.input
  if (td != null && td !== '') {
    logger.info('Provision ThingDescription: ' + td)
    server.runServer(td)
  } else {
    logger.error('Missing thing description to be served')
  }
} else if (args._[0] === 'get') {
  if (args.oid != null && args.property != null) {
    logger.info('Executing get ...')
    get.get(config.getway.host,
      config.gateway.port,
      args.oid,
      args.property,
      config.adapter.publicKey)
  }
}

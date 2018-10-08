var request = require('request')
var fs = require('fs')

exports.loginAdapterInGatewayAPI = function (host, port, user, password) {
  var options = { method: 'GET',
    url: 'http://' + host + ':' + port + '/api/objects/login',
    headers:
     { Authorization: 'Basic ' + Buffer.from(user + ':' + password).toString('base64') } }

  request(options, function (error, response, body) {
    if (error) throw new Error(error)

    console.log(body)
  })
}

exports.loginDeviceInGatewayAPI = function (host, port, credentialFileName){
  var rawdata = fs.readFileSync(credentialFileName)
  var credentialData = JSON.parse(rawdata)

  exports.loginAdapterInGatewayAPI(host, port, credentialData.oid, credentialData.password)
}

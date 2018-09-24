var request = require('request')

exports.loginInGatewayAPI = function (host, port, user, password) {
  var options = { method: 'GET',
    url: 'http://' + host + ':' + port + '/api/objects/login',
    headers:
     { 'Postman-Token': '80536864-aa18-4daf-9529-89ece1d3d7c1',
       'Cache-Control': 'no-cache',
       Authorization: 'Basic ' + Buffer.from(user + ':' + password).toString('base64') } }

  request(options, function (error, response, body) {
    if (error) throw new Error(error)

    console.log(body)
  })
}

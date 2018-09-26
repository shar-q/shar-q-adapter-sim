var request = required('request')

//Function performing the registration of the thing description
exports.sendRegistration = function (agentId, tdFile){
  var rawTD = fs.readFileSync(tdFile)
  var objectTD = JSON.parse(rawTD)

  if (object == null || object === {} || object ==='') {
    logger.error('I had a problem to read thing description!')
  } else {

    var options = { method: 'POST',
      url: 'http://localhost:8181/api/agents/' + agentId + '/objects',
      headers:
       { Authorization: 'Basic ZTM1NGNiNjgtNGQ3OS00ZDRiLWE4MjItMTgzOWU1NDM2YjY0OnRlc3Q=',
         'Content-Type': 'application/json' },
      body:
        {
          adid: agentId,
          thingDescriptions: [objecTD]},
      json: true };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      console.log(body);
    });
  }
  return expandedThingDescription
}

var request = require("request");

var options = { method: 'POST',
  url: 'http://localhost:8181/api/agents/e354cb68-4d79-4d4b-a822-1839e5436b64/objects',
  headers:
   { 'Postman-Token': 'cae788d9-ce7d-4c3e-8446-3238d3688075',
     'Cache-Control': 'no-cache',
     Authorization: 'Basic ZTM1NGNiNjgtNGQ3OS00ZDRiLWE4MjItMTgzOWU1NDM2YjY0OnRlc3Q=',
     'Content-Type': 'application/json' },
  body:
   ,
  json: true };

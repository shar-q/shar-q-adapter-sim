var fs = require('fs')
var log4js = require('log4js')
var logger = log4js.getLogger()

module.exports.serializeOidSecretes = function(oidSecretes, workingDir) {
  //TODO: Check working Dir

    oidSecretes.forEach(function(element)
      {
        logger.debug('Storing oid: ' + element.oid)

        var json = JSON.stringify(element)
        fs.writeFileSync(workingDir + '/' +   element["infrastructure-id"] + '-' + element.oid + '.json', json, 'utf8')
      }
    )
}

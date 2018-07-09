var enviroment = require('../Enviroment/enviromentManager');
module.exports = {
  initServer: function(app){
    //run a server listen to the port WEB_SERVER_PORT on localhost
    var server = app.listen(enviroment.WEB_SERVER_PORT, function(){
      var address = server.address().address;
      var port = server.address().port;
      console.log("serving at => " + address + ":" + port);
    });
  },

  initHttpsServer: function(app){
    var https = require('https');
    var fs = require('fs');

    /**
    * SSL options initialization.
    */
    var sslOptions = {
      key: fs.readFileSync(__dirname + '/ssl-cert/key.pem'),
      cert: fs.readFileSync(__dirname + '/ssl-cert/cert.pem')
      // requestCert: true,
      // rejectUnauthorized: false
    };

    var secureServer = https.createServer(sslOptions, app).listen(enviroment.HTTPS_SERVER_PORT, function () {
      var port = secureServer.address().port;
      console.log("Secure server listening on port: " + port);
    });
  }
}
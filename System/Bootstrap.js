var enviroment = require('./Enviroment/enviromentManager');

module.exports = ()=>{
  /**
   * Generate Base Swagger Docs File
   */
  var swagger = require('./Http/Swagger');
  swagger.generateDocsFile();


  /**
   * Express initialization and configuration
   */
  var express = require('express'); //the main library
  var app = express();
  require('./Http/express').configureExpress(express, app, enviroment);


  /**
   * Init caching
   */
  var Cacher = require('./Database/Cacher');
  if(require('./Enviroment/enviromentManager').USE_QUERY_CACHE === 'true'){
      Cacher.initClient();
  }

  /**
   * Database connection pools initialization
   */
  var MysqlConnectionManager = require('./Database/MysqlConnectionManager');
  MysqlConnectionManager.initPools();
  MysqlConnectionManager.keepAlive();
  /**
   * Web Server initialization
   */
  if(enviroment.NAME != 'test'){
      var WebServer = require('./Http/WebServer');
      WebServer.initServer(app);
      if(enviroment.OPEN_HTTPS === 'true'){
        WebServer.initHttpsServer(app);
      }
  }

  /**
   * Express Routes initialization
   */
  var Routes = require('./Http/Routes');
  Routes.initRoutes(app);

  //return the express app
  return app;
}
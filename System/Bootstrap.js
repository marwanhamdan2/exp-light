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
    Cacher.initRedisCacheClient();
    if(require('./Enviroment/enviromentManager').USE_QUERY_CACHE === 'true'){
        Cacher.initQueryCacheClient();
    }

    /**
     * Database connection pools initialization
     */
    var databaseConnectionManager = require('./Database/DatabaseConnectionManager');
    databaseConnectionManager.initPools();
    databaseConnectionManager.keepAlive();
    /**
     * Web Server initialization
     */
    if(enviroment.NAME != 'test'){
        var WebServer = require('./Http/WebServer');
        WebServer.initServer(app);
    }

    /**
     * Express Routes initialization
     */
    var Routes = require('./Http/Routes');
    Routes.initRoutes(app);

    //return the express app
    return app;
}
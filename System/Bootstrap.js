module.exports = ()=>{
    /**
     * Express initialization and configuration
     */
    var express = require('express'); //the main library
    var app = express();
    require('./Http/express').configureExpress(express, app);


    /**
     * Database connection pools initialization
     */
    var databaseConnectionManager = require('./Database/DatabaseConnectionManager');
    databaseConnectionManager.initPools();

    /**
     * Web Server initialization
     */
    var WebServer = require('./Http/WebServer');
    WebServer.initServer(app);

    /**
     * Express Routes initialization
     */
    var Routes = require('./Http/Routes');
    Routes.initRoutes(app);
}
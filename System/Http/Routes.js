const MIDDLEWARES_PATH = '../../App/Middlewares/';
const CONTROLLERS_PATH = '../../App/Controllers/';
const cache = require('express-redis-cache')(require('./Cache').configurations);

/**
 * Define the error handler of the cache
 */
cache.on('error', require('./Cache').errorHandler);

var routeHandler = function(req, res, controllerAction, middlewares){
    next = true;
    for(index=0; index<middlewares.length; index++){
        if(!middlewares[index](req, res)){
            next = false;
            break;
        }
    }
    if(next)
        controllerAction(req, res);
}

module.exports = {
    initRoutes: function(app){
        var routesList = require('./RoutesList');
        routesList.forEach((route) => {
            var controllerAction = require(CONTROLLERS_PATH+route.controllerAction);
            var middlewares = route.middlewares.map((middleware)=>{
                return require(MIDDLEWARES_PATH+middleware);
            });
            switch(route.verb){
                case 'get':
                    if(route.useCache){
                        app.get(route.route, cache.route(), function(req, res){
                            routeHandler(req, res, controllerAction, middlewares)
                        });
                    }else{
                        app.get(route.route, function(req, res){
                            routeHandler(req, res, controllerAction, middlewares)
                        });               
                    }
                    break;
                case 'post':
                    if(route.useCache){
                        app.post(route.route, cache.route(), function(req, res){
                            routeHandler(req, res, controllerAction, middlewares)
                        });
                    }else{
                        app.post(route.route, function(req, res){
                            routeHandler(req, res, controllerAction, middlewares)
                        });
                    }
                    break;
            }
        });
    }
}

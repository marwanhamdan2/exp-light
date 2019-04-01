const MIDDLEWARES_PATH = '../../App/Middlewares/';
const CONTROLLERS_PATH = '../../App/Controllers/';
const POSTMIDDLEWARES_PATH = '../../App/PostMiddlewares/';
const Enviroment = require('../Enviroment/enviromentManager');

/**
 * Define the error handler of the cache
 */
var cache;
if(Enviroment.USE_HTTP_CACHE == 'true'){
  cache = require('express-redis-cache')(require('./Cache').configurations);
  cache.on('error', require('./Cache').errorHandler);
}

var routeHandler = async function(req, res, controllerAction, middlewares, postMiddlewares){
  next = true;
  //synchronous checkers 
  for(index=0; index<middlewares.length; index++){
    try{
      await middlewares[index](req, res);
    }catch(err){
      next = false;
      break;
    }
  }
  if(next){
    req.postMiddlewares = postMiddlewares;
    controllerAction(req, res);
  }
}


module.exports = {
  initRoutes: function(app){
    var routesList = require('./RoutesList');
    routesList.forEach((route) => {
      var controllerAction = require(CONTROLLERS_PATH+route.controllerAction);
      var middlewares = route.middlewares.map((middleware)=>{
          return require(MIDDLEWARES_PATH+middleware);
      });

      var postMiddlewares = route.postMiddlewares || [];
      postMiddlewares = postMiddlewares.map(pm=>{
        return require(POSTMIDDLEWARES_PATH + pm);
      });

      var handlerCallback = function(req, res){
        routeHandler(req, res, controllerAction, middlewares, postMiddlewares)
      }
      
      if(route.verb == 'get' || route.verb == 'GET'){
        if(route.useCache && Enviroment.USE_HTTP_CACHE == 'true'){
          app.get(route.route, cache.route(), handlerCallback);
        }else{
          app.get(route.route, handlerCallback);
        }
      }else if(route.verb == 'post' || route.verb == 'POST'){
        app.post(route.route, handlerCallback);
      }else if(route.verb == 'put' || route.verb == 'PUT'){
        app.put(route.route, handlerCallback);
      }else if(route.verb == 'delete' || route.verb == 'DELETE'){
        app.delete(route.route, handlerCallback);
      }
    });
  }
}

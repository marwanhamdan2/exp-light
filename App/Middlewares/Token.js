var ResponseBuilder = require('../Utils/ResponseBuilder');
var Enviroment =  require('../../System/Enviroment/enviromentManager');

module.exports = function(req, res){
  var token = req.query._t;
  if(typeof token === 'undefined'){
    res.json(ResponseBuilder.buildErrorResponse("Invalid Api Key", 401, "error"));
    return Promise.reject();
  }else if(token != Enviroment.TOKEN){
    res.json(ResponseBuilder.buildErrorResponse("Invalid Api Key", 401, "error"));
    return Promise.reject();        
  }
  return Promise.resolve();
}
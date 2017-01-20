var responseBuilder = require('../Utils/ResponseBuilder');
var enviroment =  require('../../System/Enviroment/enviromentManager');

module.exports = function(req, res){
    var token = req.query._t;
    if(typeof token === 'undefined'){
        res.json(responseBuilder.buildErrorResponse("Invalid Api Key", 401, "error"));
        return false;
    }else if(token != enviroment.TOKEN){
        res.json(responseBuilder.buildErrorResponse("Invalid Api Key", 401, "error"));
        return false;        
    }
    return true;
}
var fs = require('fs');
const _ = require('lodash');
const swaggerFileLocation = __dirname + '/../../swagger.json';
var routesList = require('./RoutesList');

var swaggerBaseRef = {
   "swagger": "2.0",
   "info": {
     "title": "KPI Dashboard",
     "description": "KPI Dashboard",
     "version": "1.0"
   },
   "basePath": "/",
   "paths": {
    }
}


module.exports = {
  generateDocsFile: function(){
    try{
      fs.unlinkSync(swaggerFileLocation);      
    }catch(err){};

    routesList.forEach(route=>{
      var verb = route.verb;
      var path = route.route;
      var swaggerInfo = route.swaggerDocs;
      if(swaggerInfo){
        var description = swaggerInfo.description;
        var produces = swaggerInfo.produces;
        var consumes = swaggerInfo.consumes;
        var params = swaggerInfo.params || [];
          
        var swaggerParameters = [];
        params.forEach(param=>{
          if(_.includes(['query', 'path', 'header'], param.in.toLowerCase())){
            swaggerParameters.push({
              "in" : param.in,
              "name" : param.name, 
              "schema" : {
                  "type" : param.type
              }
            });
          }else if(param.in.toLowerCase() == "body"){
            var properties = {};
            if(param.params){
              param.params.forEach(_param=>{
                properties[`${_param}`] = {
                  "type" : "string"
                }
              });
              swaggerParameters.push({
                "in": "body",
                "name": "Body",
                "schema": {
                  "type": "object",
                  "properties": properties
                }
              })
            }
          }
        });

        
        var swaggerRouteRef = {
          tags : [`${path}`],
          description: description,
          produces : produces,
          parameters: swaggerParameters,
          consumes : consumes,
          responses: {}
        }

        //convert express style to swagger style
        var swaggerStylePath = path.replace(/(:)(\w+)/g, '{$2}');
        if(!swaggerBaseRef.paths[`${swaggerStylePath}`]){
          swaggerBaseRef.paths[`${swaggerStylePath}`] = {};
        }
        swaggerBaseRef.paths[`${swaggerStylePath}`][`${verb}`] = swaggerRouteRef;
      }
    })
    
    
    fs.writeFileSync(swaggerFileLocation, JSON.stringify(swaggerBaseRef));
  }
}
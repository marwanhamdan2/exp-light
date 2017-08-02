const ResponseBuilder = require('../../Utils/ResponseBuilder');
const DepartmentService = require('../../Services/DepartmentService');
const Logger = require('../../Utils/Logger');

module.exports = function(req, res){
  var deptId = req.params.id || null;
  console.log("headers", req.headers);
  console.log("path", req.params);
  console.log("query", req.query);
  
  if(!deptId){
    return res.json(ResponseBuilder.buildErrorResponse("department id is not provided"));
  }

  DepartmentService.fetchDepartmentEmployees(deptId)
  .then((emps)=>{
    res.json(ResponseBuilder.buildSuccessResponse(emps));
  })
  .catch((err)=>{
    Logger.info(`APP-ERROR: Sample/DepartmentEmployees - ${new Date().toUTCString()}`)
    Logger.error(err);
    return res.status(500).json(ResponseBuilder.buildErrorResponse(err));
  });
}
const ResponseBuilder = require('../../Utils/ResponseBuilder');
const DepartmentService = require('../../Services/DepartmentService');
const Logger = require('../../Utils/Logger');

module.exports = function(req, res){
  DepartmentService.fetchDepartments()
  .then((depts)=>{
    res.json(ResponseBuilder.buildSuccessResponse(depts));
  })
  .catch((err)=>{
    Logger.info(`APP-ERROR: Sample/DepartmentEmployees - ${new Date().toUTCString()}`)
    Logger.error(err);
    res.json(ResponseBuilder.buildErrorResponse(err))
  });
}
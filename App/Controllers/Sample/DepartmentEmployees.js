var responseBuilder = require('../../Utils/ResponseBuilder');
var departmentService = require('../../Services/sample/Department');

module.exports = function(req, res){
    var deptId = req.params.id || null;

    if(!deptId){
        res.json(
            responseBuilder.buildErrorResponse("department id is not provided")
        );
    }else{
        departmentService.fetchDepartmentEmployees(deptId)
        .then((emps)=>{
            res.json(
                responseBuilder.buildSuccessResponse(emps)
            );
        })
        .catch((err)=>{
            res.json(
                responseBuilder.buildErrorResponse(err)
            );
        });
    }
}
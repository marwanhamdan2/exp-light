var responseBuilder = require('../../Utils/ResponseBuilder');
var departmentService =  require('../../Services/sample/Department');

module.exports = function(req, res){
    departmentService.fetchDepartments()
    .then((depts)=>{
        res.json(
            responseBuilder.buildSuccessResponse(depts)
        );
    })
    .catch((err)=>{
        res.json(
            responseBuilder.buildErrorResponse(err)
        )
    });
}
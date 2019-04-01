const ResponseBuilder = require('../../Utils/ResponseBuilder');

module.exports = function(req, res){
    res.status(200).json(ResponseBuilder.buildSuccessResponse({
        msg: "hello"
    }));
}
module.exports = function(req, res){
    var apiAccessClientId = req.apiAccessClientId;
    try{
        var timeDate = new Date();
        var reqMethod = req.method;
        var reqPath = req.url;
        var reqHeaders = req.headers;
        var responseCode = res.statusCode;

        console.log("Log pm: ", timeDate, reqMethod, reqPath, responseCode);
        //log request to db

    }catch(err){
    }
}
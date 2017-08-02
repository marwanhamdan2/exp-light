module.exports = {
  buildErrorResponse : function(errMessage, code, status){
    var code = code || 500;
    var status = status || "error"
    return {
      status: status,
      code: code,
      message: errMessage
    }
  },
  buildSuccessResponse : function(content, succMessage, status){
    var status = status || "success";
    return {
      status : status,
      content: content,
      message: succMessage
    }
  }
}
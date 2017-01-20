var enviroment = require('../Enviroment/enviromentManager');
module.exports = {
    configurations: {
        host: enviroment.CACHE_HOST,
        port : enviroment.CACHE_PORT ,
        expire : enviroment.CACHE_EXPIRE ,
        prefix : process.env.NODE_ENV || 'local'
    },
    errorHandler: function(err){
        console.log("Cache error: ", err);
    }
}

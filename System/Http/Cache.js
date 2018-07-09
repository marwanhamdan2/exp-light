var enviroment = require('../Enviroment/enviromentManager');
module.exports = {
    configurations: {
        host: enviroment.REDIS_HOST,
        port : enviroment.REDIS_PORT ,
        auth_pass: enviroment.REDIS_PASSWORD ? enviroment.REDIS_PASSWORD : undefined,
        expire : enviroment.REDIS_EXPIRE ,
        prefix : process.env.NODE_ENV || 'local'
    },
    errorHandler: function(err){
        console.log("Cache error: ", err);
    }
}

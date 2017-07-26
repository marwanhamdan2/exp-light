var enviroment = {};
if(process.env.NODE_ENV == 'production'){
    enviroment = require('./production');
}else{
    enviroment = require('./development');
}
module.exports = enviroment;
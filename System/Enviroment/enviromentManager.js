var enviroment = {};
if(process.env.NODE_ENV == 'production'){
    enviroment = require('./production');
}else if(process.env.NODE_ENV == 'test'){
    enviroment = require('./test');
}else{
    enviroment = require('./development');
}
module.exports = enviroment;
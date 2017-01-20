var enviroment = {};
if(process.env.NODE_ENV == 'production'){
    enviroment = require('./production');
}else if(process.env.NODE_ENV == 'development'){
    enviroment = require('./development');
}else{
    enviroment = require('./local');
}
module.exports = enviroment;
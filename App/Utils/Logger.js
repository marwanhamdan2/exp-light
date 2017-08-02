const winston      = require('winston');
const enviroment = require('../../System/Enviroment/enviromentManager');

/**
 * Logger Instance (Private)
 */
var logger = null; 

/**
 * Get Signlton Instance 
 */
function getLogger() {
  if(logger == null) {
    logger = new winston.Logger({
      transports: [
          new (winston.transports.Console)()
      ]
    });
  }
  return logger;
} 

/**
 * Set the log level based on environment DEBUG value 
 */
getLogger().transports.console.level = enviroment.DEBUG ? 'debug' : 'error' ;

/**
 * Export (public module)
 */
module.exports = getLogger();
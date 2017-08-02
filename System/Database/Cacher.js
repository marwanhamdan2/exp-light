const env = require('../Enviroment/enviromentManager');
const md5 = require('md5');
const redis = require('redis');
const logger = require('../../App/Utils/Logger')
/**
 * Query Cache Manager
 * 
 */
var defaultCacheExpire = env.REDIS_EXPIRE;
var client = null;

module.exports = {
  /**
   * init general purpose redis cache client
   */
  initClient: function(){
    if(!client){
      const conf = {
        host: env.REDIS_HOST,
        port: env.REDIS_PORT
      };

      if(env.REDIS_PASSWORD){
        conf.password = env.REDIS_PASSWORD;
      }

      client = redis.createClient(conf);
      client.on("error", (err) => {
        logger.info(`Redis client emitted error  - ${new Date().toUTCString()}`);
        logger.error(err);       
      });

      client.on("connect", () => {
        logger.info(`Redis client is connected  - ${new Date().toUTCString()}`);
      });
  
      client.on("ready", () => {
        logger.info(`Redis client is ready  - ${new Date().toUTCString()}`);
      });   

      client.on("reconnecting", () => {
        logger.info(`Redis client is reconnecting  - ${new Date().toUTCString()}`);
      });    

      client.on("end", () => {
        logger.info(`Redis client end  - ${new Date().toUTCString()}`);
      });
    }
  },

  getClient : function(){
    return client;
  },

  setKey: function(key, value, expTime){
    console.log(key, value);
    return new Promise((resolve, reject)=>{
      var client = this.getClient();
      if(!client){
        return reject();
      }
      client.set(key, value, 'EX', expTime || defaultCacheExpire, (err, reply)=>{
        return err ? reject() :  resolve();
      })
    });
  },

  getKey: function(key){
    return new Promise((resolve, reject)=>{
      var client = this.getClient();
      if(!client){
        return reject();
      }
      client.get(key, (err, value)=>{
        return err ? resolve(null) : value ?  resolve(value) : resolve(null);
      })
    });
  },

  deleteKey: function(key){
    return new Promise((resolve, reject)=>{
      var client = this.getClient();
      if(!client){
        return reject();
      }
      client.del(key, (err, value)=>{
        return err ? reject(err) :  resolve(value);
      })
    });        
  },
}
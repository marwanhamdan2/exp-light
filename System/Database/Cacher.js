var env = require('../Enviroment/enviromentManager');
var md5 = require('md5');
var redis = require('redis');
var logger = require('../../App/Utils/Logger')
/**
 * Query Cache Manager
 * 
 */
var defaultCacheExpire = env.CACHE_EXPIRE;

var queryCacheClient = null;
var redisCacheClient = null;

module.exports = {
    initQueryCacheClient: function(){
        var cacheEngine = env.QUERY_CACHE_CONFIG.engine || null;
        if(!cacheEngine)
            return;
        
        var cacheConfigurations = env.QUERY_CACHE_CONFIG[cacheEngine];

        if(!queryCacheClient && cacheConfigurations){
            //console.log('create cache instance');
            try{
                var instance = null;

                if(cacheEngine == 'file' || cacheEngine == 'memory'){
                    var cacheT = require(`cacheman-${cacheEngine}`);
                    instance = new cacheT(cacheConfigurations);
                    queryCacheClient = instance;
                }else if(cacheEngine == 'redis'){
                    instance = redis.createClient(cacheConfigurations);

                    instance.on("error", (err) => {
                        //console.log("redis cache error: " + err);
                        queryCacheClient = null;
                    });

                    instance.on("connect", () => {
                        //console.log("cache query redis: connected!");
                        queryCacheClient = instance;
                    });
                
                    instance.on("ready", () => {
                        //console.log("cache query redis: ready!");
                        queryCacheClient = instance;
                    });   

                    instance.on("reconnecting", () => {
                        //console.log("cache query redis: reconnecting!");
                        queryCacheClient = null;
                    });    

                    instance.on("end", () => {
                        //console.log("cache query redis: end!");
                        queryCacheClient = null;
                    });
                }
            }
            catch(err){
                //console.log('query cache exception: ', err);
            }
        }
    },


    /**
     * init general purpose redis cache client
     */
    initRedisCacheClient: function(){
        if(!redisCacheClient){
            const conf = {
                host: env.CACHE_HOST,
                port: env.CACHE_PORT
            };

            if(env.CACHE_PASSWORD){
                conf.password = env.CACHE_PASSWORD;
            }

            redisCacheClient = redis.createClient(conf);
            redisCacheClient.on("error", (err) => {
                logger.info(`Redis client emitted error  - ${new Date().toUTCString()}`);
                logger.error(err);       
            });
        }
    },

    getRedisCacheClient : function(){
        return redisCacheClient;
    },

    setRedisCacheKey: function(key, value, expTime){
        return new Promise((resolve, reject)=>{
            var client = this.getRedisCacheClient();
            if(!client){
                return reject();
            }
            client.set(key, value, 'EX', expTime || defaultCacheExpire, (err, reply)=>{
                return err ? reject() :  resolve();
            })
        });
    },

    getRedisCacheKey: function(key){
        return new Promise((resolve, reject)=>{
            var client = this.getRedisCacheClient();
            if(!client){
                return reject();
            }
            client.get(key, (err, value)=>{
                return err ? reject(err) : value ?  resolve(value) : resolve(null);
            })
        });
    },

    deleteRedisCacheKey: function(key){
        return new Promise((resolve, reject)=>{
            var client = this.getRedisCacheClient();
            if(!client){
                return reject();
            }
            client.del(key, (err, value)=>{
                return err ? reject(err) :  resolve(value);
            })
        });        
    },

    setQueryResult: function(query, results){
        var cacheEngine = env.QUERY_CACHE_CONFIG.engine || null;
        if(cacheEngine == 'redis'){
            return this.setQueryResultRedis(query, results);
        }else{
            return this.setQueryResultFileMemory(query, results);
        }
    },

    getQueryResult: function(query){
        var cacheEngine = env.QUERY_CACHE_CONFIG.engine || null;
        if(cacheEngine == 'redis'){
            return this.getQueryResultRedis(query);
        }else{
            return this.getQueryResultFileMemory(query);
        }
    },

    setQueryResultRedis: function(query, results){
        return new Promise((resolve, reject)=>{
            if(env.USE_QUERY_CACHE !== 'true'){
                return reject('');
            }

            if(!queryCacheClient){
                return reject('cache client failed to initialize!');
            }

            var ttl = env.QUERY_CACHE_CONFIG.ttl;
            var key = md5(query);
            results = JSON.stringify(results) || "[]";
            queryCacheClient.set(key, results, redis.print);
            queryCacheClient.expire(key, ttl);
        });
    },

    getQueryResultRedis: function(query){
        return new Promise((resolve, reject)=>{
            if(env.USE_QUERY_CACHE !== 'true'){
                return reject('');
            }

            if(!queryCacheClient){
                return reject('cache client failed to initialize!');
            }

            var key = md5(query);
            queryCacheClient.get(key, function(err, value){
                if(err || !value){
                    reject(err);
                }else{
                    value = JSON.parse(value) || [];
                    resolve(value);
                }
            });
        });
    },

    setQueryResultFileMemory: function(query, results){
        return new Promise((resolve, reject)=>{
            if(env.USE_QUERY_CACHE !== 'true'){
                return reject('');
            }

            if(!queryCacheClient){
                return reject('cache client failed to initialize!');
            }

            var ttl = env.QUERY_CACHE_CONFIG.ttl;
            var key = md5(query);
            queryCacheClient.set(key, results, ttl, function(err, value){               
                if(err){
                    reject(err);
                }else{
                    resolve(value);
                }                
            });
        });
    },

    getQueryResultFileMemory: function(query){
        return new Promise((resolve, reject)=>{
            if(env.USE_QUERY_CACHE !== 'true'){
                return reject('');
            }

            if(!queryCacheClient){
                return reject('cache client failed to initialize!');
            }

            var key = md5(query);
            queryCacheClient.get(key, function(err, value){
                if(err || !value){
                    reject(err);
                }else{
                    resolve(value);
                }
            });
        });
    }
}
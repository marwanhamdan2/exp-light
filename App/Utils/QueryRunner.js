var databaseConnectionManager = require('../../System/Database/MysqlConnectionManager');
var Cacher = require('../../System/Database/Cacher');
const Enviroment = require('../../System/Enviroment/enviromentManager');
const logger  = require('./Logger');
const md5 = require('md5');

function runQueryPromise(pool, query, qParams, cacheOptions){
  if(pool == null){
    return Promise.reject("connection pool is not found".red);
  }

  return new Promise((resolve, reject)=>{
    pool.getConnection((err, connection) =>{
      if(err){
        return reject(err);
      }

      var queryResCallback = (err, qData)=>{
        connection.release();
        if(err){
          return reject(err);
        }
        console.log(cacheOptions);
        if(cacheOptions.cacheFlag){
          var value = JSON.stringify(qData) || "[]";
          Cacher.setKey(cacheOptions.key, value).catch(err=>{});
        }
        return resolve(qData);
      };

      if(qParams){
        connection.query(query, queryResCallback);
      }else{
        connection.query(query, qParams, queryResCallback);
      }
    });
  })
}


module.exports = {
    runQuery: function (connection, query, qParams, type, useCache) {
      //db replica type
      var type = type || 'read';
      //which connection
      var connectionx = connection == 'default' ? connection : parseInt(connection);
      const pool = databaseConnectionManager.getPool(connectionx, type);

      //is query cache enabled
      var useQueryCache = Enviroment.USE_QUERY_CACHE;
      //shold use caching for this query
      if(!useCache){
          var useCache = 'true';
      }
      var useCacheFlag = type == 'read' && useQueryCache== 'true' && useCache == 'true';

      var startTime = new Date();
      
      var cacheKey;
      if(qParams){
        cacheKey = md5(query + JSON.stringify(qParams) + connectionx);
      }else{
        cacheKey = md5(query + connectionx);
      }
      
      var flowRef;
      if(useCacheFlag){
        flowRef = Cacher.getKey(cacheKey).then(value=>{
          try{
            var parsed = JSON.parse(value);
            if(parsed){
              return parsed;
            }
          }catch(exp){}
          return runQueryPromise(pool, query, qParams, {
            cacheFlag: useCacheFlag, key: cacheKey
          })
        })
      }else{
        flowRef = runQueryPromise(pool, query, qParams, { cacheFlag: false });
      }

      return flowRef
      .then(dbRes=>{
        console.log("here");
        var endTime = (new Date());
        var elappsed = endTime - startTime;
        var logMessage = `DB-ACCESS: SUCCESS - region-${connection}-${type} - useCache=${useCacheFlag} - ${new Date().toUTCString()} - ${elappsed}ms`;
        logger.info(logMessage)
        return Promise.resolve(dbRes);
      })
      .catch(err=>{
        console.log("here2");
        var endTime = (new Date());
        var elappsed = endTime - startTime;
        var logMessage = `DB-ACCESS: FAIL - region-${connection}-${type} - useCache=${useCacheFlag} - ${new Date().toUTCString()} - ${err}`;
        logger.info(logMessage)
        return Promise.reject(err);
      })
    }
}
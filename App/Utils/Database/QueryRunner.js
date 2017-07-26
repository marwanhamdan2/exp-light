var databaseConnectionManager = require('../../../System/Database/DatabaseConnectionManager');
var queryCacher = require('../../../System/Database/Cacher');
var env = require('../../../System/Enviroment/enviromentManager');
const logger  = require('../Logger');

module.exports = {
    runQuery: function (connection, query, type, useCache) {
        if(!useCache){
            var useCache = 'true';
        }    

        var type = type || 'read';
        var connectionx = connection == 'default' ? connection : parseInt(connection);
        const pool = databaseConnectionManager.getPool(connectionx, type);

        var startTime = new Date();
        return new Promise((resolve, reject) => {
            //console.log(`QueryRunner: connection ${connectionx} ${type} >> `.bgYellow, query);

            /**
             * Check the queryCacher
             */
             if(type == 'read' && useCache == 'true'){
                var key = query + connectionx;
                queryCacher.getQueryResult(key)
                .then(results=>{
                    //console.log('fetch query results from cache!'.green);
                    resolve(results);
                })
                .catch(err=>{
                    if(pool == null){
                        return reject("connection pool is not found".red);
                    }
                    pool.getConnection((err, connection) =>{
                        if(err){
                            return reject(err);
                        }
                        connection.query(query, (err, row)=>{
                            connection.release();
                            if(err){
                                return reject(err);
                            }
                            if(env.USE_QUERY_CACHE === 'true')
                                queryCacher.setQueryResult(key, row).catch(err=>{/*console.log(err)*/});
                            return resolve(row);
                        })
                    });
                })
             }else{
                if(pool == null){
                    return reject("connection pool is not found".red);
                }
                pool.getConnection((err, connection) =>{
                    if(err){
                        return reject(err);
                    }
                    connection.query(query, (err, row)=>{
                        connection.release();
                        if(err){
                            return reject(err);
                        }
                        return resolve(row);
                    })
                });
             }
        })
        .then(dbRes=>{
            var endTime = (new Date());
            var elappsed = endTime - startTime;
            var logMessage = `DB-ACCESS: SUCCESS - region-${connection}-${type} - useCache=${useCache} - ${new Date().toUTCString()} - ${elappsed}ms`;
            logger.info(logMessage)
            return Promise.resolve(dbRes);
        })
        .catch(err=>{
            var endTime = (new Date());
            var elappsed = endTime - startTime;
            var logMessage = `DB-ACCESS: FAIL - region-${connection}-${type} - useCache=${useCache} - ${new Date().toUTCString()} - ${err}`;
            logger.info(logMessage)
            return Promise.reject(err);
        }) 
    },

    runQueryWP: function (connection, query, qParams, type, useCache) {
        if(!useCache){
            var useCache = 'true';
        }        
        var type = type || 'read';
        var connectionx = connection == 'default' ? connection : parseInt(connection);
        const pool = databaseConnectionManager.getPool(connectionx, type);

        var startTime = new Date();
        return new Promise((resolve, reject) => {
            //console.log(`QueryRunner: connection ${connectionx} ${type} >> `.bgYellow, query);

            /**
             * Check the queryCacher
             */
            if(type=='read' && useCache=='true'){
                var key = query + JSON.stringify(qParams) + connectionx;
                queryCacher.getQueryResult(key)
                .then(results=>{
                    //console.log('fetch query results from cache!'.green);
                    resolve(results);
                })
                .catch(err=>{
                    if(pool == null){
                        return reject("connection pool is not found");
                    }
                    pool.getConnection((err, connection) =>{
                        if(err){
                            return reject(err);
                        }
                        connection.query(query, qParams, (err, row)=>{
                            connection.release();
                            if(err){
                                return reject(err);
                            }
                            if(env.USE_QUERY_CACHE === 'true')
                                queryCacher.setQueryResult(key, row).catch(err=>{/*console.log(err)*/});
                            return resolve(row);
                        })
                    });
                });
            }else{
                if(pool == null){
                    return reject("connection pool is not found");
                }
                pool.getConnection((err, connection) =>{
                    if(err){
                        return reject(err);
                    }
                    connection.query(query, qParams, (err, row)=>{
                        connection.release();
                        if(err){
                            return reject(err);
                        }
                        return resolve(row);
                    })
                });                
            }
        })
        .then(dbRes=>{
            var endTime = (new Date());
            var elappsed = endTime - startTime;
            var logMessage = `DB-ACCESS: SUCCESS - region-${connection}-${type} - useCache=${useCache} - ${new Date().toUTCString()} - ${elappsed}ms`;
            logger.info(logMessage)
            return Promise.resolve(dbRes);
        })
        .catch(err=>{
            var endTime = (new Date());
            var elappsed = endTime - startTime;
            var logMessage = `DB-ACCESS: FAIL - region-${connection}-${type} - useCache=${useCache} - ${new Date().toUTCString()} - ${err}`;
            logger.info(logMessage)
            return Promise.reject(err);
        })  
    },
}
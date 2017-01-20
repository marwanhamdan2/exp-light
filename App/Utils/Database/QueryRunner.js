var databaseConnectionManager = require('../../../System/Database/DatabaseConnectionManager');

module.exports = {
    runQuery: function (connection, query, type) {
        var type = type || 'read';
        connection = connection == 'default' ? connection : parseInt(connection);
        const pool = databaseConnectionManager.getPool(connection, type);
        return new Promise((resolve, reject) => {
            if(pool == null){
                return reject("connection pool is not found");
            }
            var connection = pool.getConnection((err, connection) =>{
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
        }); 
    },

    runQueryWP: function (connection, query, qParams, type) {
        var type = type || 'read';
        connection = connection == 'default' ? connection : parseInt(connection);
        const pool = databaseConnectionManager.getPool(connection, type);
        return new Promise((resolve, reject) => {
            if(pool == null){
                return reject("connection pool is not found");
            }
            var connection = pool.getConnection((err, connection) =>{
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
        }); 
    },
}
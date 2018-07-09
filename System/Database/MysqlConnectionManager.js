var mysql = require('mysql'); //mysql driver for node.js
var enviroment  = require('../Enviroment/enviromentManager');

var connectionPools = {};

function getConnectionRef(key){
    return enviroment.MYSQL_CONNECTIONS[key] || null;
}

module.exports = {
    initPools : ()=>{
        var connectionKeys = Object.keys(enviroment.MYSQL_CONNECTIONS);
        connectionKeys.forEach(connectionKey=>{
            var connectionRef = getConnectionRef(connectionKey);
            var readConnection =  JSON.parse(JSON.stringify(connectionRef));
            readConnection.host = readConnection["host_read"];
            var writeConnection = JSON.parse(JSON.stringify(connectionRef));
            writeConnection.host = writeConnection["host_write"];

            var poolReadKey = [connectionKey, 'read'].join('_');
            var poolWriteKey = [connectionKey, 'write'].join('_');

            connectionPools[poolReadKey] = mysql.createPool(readConnection);
            connectionPools[poolWriteKey] = mysql.createPool(writeConnection);
        });

        return connectionPools;
    },

    getPool : (connection, type)=>{
      var connection = connection || 'default';
      var type = type || 'read';
      var poolKey = [connection, type].join("_");
      return connectionPools[poolKey] || null;
   },

    keepAlive: function(){
        var keepAliveFunc = ()=>{
            Object.keys(connectionPools).forEach(poolKey=>{
                //console.log(`Refreshing ${poolKey}`)
                var pool = connectionPools[poolKey];
                if(pool){
                    pool.getConnection(function(err, connection){
                        if(err) { return; }
                        connection.query( "SELECT 1", function(err, rows) {
                            connection.release();
                            if (err) {
                                return console.log("QUERY ERROR: " + err);
                            }
                            //console.log(`Refreshing ${poolKey} `, rows, new Date());
                        });
                    });  
                }
            });
        }

        keepAliveFunc();
        setInterval(keepAliveFunc, 30000);
    }
}; 


var mysql = require('mysql'); //mysql driver for node.js
var enviroment  = require('../Enviroment/enviromentManager');

var connectionPools = {};

function getServerConnectionData(index, type){
  var type = type || 'read';
  if(index == 0)
      index = 'DEFAULT';

  var serverConnection = {};
  var serverConnectionRef = enviroment.MYSQL_CONNECTIONS['DB_SERVER_' + index];

  serverConnection.user = serverConnectionRef.user;
  serverConnection.password = serverConnectionRef.password;
  serverConnection.database = serverConnectionRef.database;
  var hostType = (type == 'read') ? 'host_read' : 'host_write';
  serverConnection.host = serverConnectionRef[hostType];

  return serverConnection;
}

module.exports = {
  initPools : ()=>{
    var serversCount = enviroment.MYSQL_CONNECTIONS.COUNT || 1;
    for(var index=1; index<=serversCount; index++){
      var pool_key_read = ['pool', index, 'read'].join('_');
      var pool_key_write = ['pool', index, 'write'].join('_');

      connectionPools[pool_key_read] = mysql.createPool(getServerConnectionData(index, 'read'));
      connectionPools[pool_key_write] = mysql.createPool(getServerConnectionData(index, 'write'));            
    }
    connectionPools['default_read'] = mysql.createPool(getServerConnectionData(0), 'read');
    connectionPools['default_write'] = mysql.createPool(getServerConnectionData(0), 'write');
    return connectionPools;
  },

  getPool : (connection, type)=>{
    var connection = connection || 'default';
    var type = type || 'read';
    if(connection == 'default'){
        return connectionPools['default_' + type];
    }else if(Number.isInteger(connection)){
        var poolKey = ['pool', connection, type].join('_');
        var pool = connectionPools[poolKey];
        if(typeof pool === 'undefined'){
            return null;
        }
        return pool;
    }else{
        return null
    }
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


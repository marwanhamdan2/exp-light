var enviroment = require('../Enviroment/enviromentManager');
module.exports = {
    initServer: function(app){
        /************ Initiate A WEB SERVER *********/
        //run a server listen to the port WEB_SERVER_PORT on localhost
        var server = app.listen(enviroment.WEB_SERVER_PORT, function(){
            var address = server.address().address;
            var port = server.address().port;
            console.log("serving at => " + address + ":" + port);
        });
        /**********************************************/
    }
}
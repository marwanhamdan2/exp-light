var bodyParser = require('body-parser'); //to handle http body  data

module.exports = {
    configureExpress: function(express, app){
        app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        app.use(bodyParser.urlencoded({ extended:true }));
        app.set('view engine', 'ejs');
        app.set('views', __dirname + '/../../Resources/views');
        app.use("/static/", express.static(__dirname + '/../../Resources/static'));
    }
}
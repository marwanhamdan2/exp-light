var bodyParser = require('body-parser'); //to handle http body  data
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../../swagger.json');


module.exports = {
    configureExpress: function(express, app, enviroment){
        app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        app.use(bodyParser.urlencoded({ extended:true }));
        app.use(bodyParser.json());
        app.set('view engine', 'ejs');
        app.set('views', __dirname + '/../../Resources/views');
        if(enviroment.NAME !== "production") {
            app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
        }

        app.use("/static/", express.static(__dirname + '/../../Resources/static'));
    }
}
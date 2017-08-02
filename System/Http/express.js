const path = require('path');
const os = require('os');
const fs = require('fs');
const bodyParser = require('body-parser'); //to handle http body  data
const busboy = require('connect-busboy');
const requestIp = require('request-ip');
const bearerToken = require('express-bearer-token');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../../swagger.json');
const Logger = require('../../App/Utils/Logger')

function defineRequestParsers(app){
  /**
   * define req body parsers
   * if using x-form-urlencded will convert it into json
   */
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json({limit: '5mb'}));
  /**
   * no parse for the following content types
   * req.body will refere to the body itself 
   */
  app.use(bodyParser.text({ type: 'text/plain' }))
  app.use(bodyParser.text({ type: 'application/xml' }))

  /**
   * define multipart request body handler
   */
  //immediate start parsing from request stream 
  //parsing so whenever file section data arrive pipe to a file once done save body map
  //whever text field arrive save to body map 
  /**
   * Expected form of body
   * {
   *      fields: {
   *          key1: val1,
   *          key2: val2
   *      },
   *  
   *      files: {
   *          file1Name: pathTo,
   *          ...
   *      }
   * }
   * 
   */

    app.use(busboy({ immediate: true }));
    app.use(function(req, res, next) {
      if(!req.busboy){
        next();
      }

    if (req.busboy) {
      req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        var saveTo = path.join(os.tmpDir(), path.basename(`${fieldname}-${filename}`));
        file.pipe(fs.createWriteStream(saveTo));
        if(!req.body){
          req.body = {};
        }
        if(!req.body.files){
          req.body.files = {};
        }
        file.on('end', function() {
          req.body.files[`${fieldname}`] = saveTo;
        });
      });

      req.busboy.on('field', function(key, value, keyTruncated, valueTruncated) {
        if(!req.body){
          req.body = {};
        }
        if(!req.body.fields){
          req.body.fields = {};
        }
        req.body.fields[`${key}`] = value;
      });
      
      req.busboy.on('finish', function(){
        next();
      });
    }
  });
  app.use(busboy({
    highWaterMark: 2 * 1024 * 1024,
    limits: {
      fileSize: 100 * 1024 * 1024 //100 mb max limit
    }
  }));
}

module.exports = {
  configureExpress: function(express, app, enviroment){
    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });


    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/../../Resources/views');
    if(enviroment.NAME !== "production") {
      app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }

    app.use("/static/", express.static(__dirname + '/../../Resources/static'));
    app.use(bearerToken());
    app.use(requestIp.mw());
    //monitor requests and responses lifecycle
    app.use(function (req, res, next) {
        var startTime = new Date();
        req.on("end", ()=>{
            var endTime = (new Date());
            var elappsed = endTime - startTime;
            var message = `HTTP-SERVER-HIT: ${req.clientIp} - ${req.method} ${req.originalUrl} ${res.statusCode} - ${startTime.toUTCString()} - ${elappsed}ms`;
            Logger.info(message);
        });
        next();
    })

    defineRequestParsers(app);
  }
}
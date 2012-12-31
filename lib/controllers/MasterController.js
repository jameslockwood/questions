var express = require('express'),
    path  = require('path');

var indexController = require('./IndexController');
var tvDisplayController = require('./TVDisplayController');

var mobileSocketController = require('./MobileSocketController');
var displaySocketController = require('./DisplaySocketController');

var loaded = false;

exports.startup = function(){

  var app = express.createServer();
  io = require('socket.io').listen(app);

  app.set('views', path.resolve(__dirname, '../', 'views'));
  app.set('view engine', 'ejs');
  app.set("view options", { layout: false })
  app.use(express.static(path.resolve(__dirname, '../', 'public')));
  app.use(express.cookieParser());

  //Bind all the controllers here
  indexController.bind(app);
  tvDisplayController.bind(app);
  
  io.configure(function () { 
    io.set('log level', 1); 
    io.set("transports", ["xhr-polling"]); 
    io.set("polling duration", 10); 
  });
  
  io.sockets.on('connection', function (socket) {
    if(!loaded){
      mobileSocketController.bind(io);
      displaySocketController.bind(io);
      loaded = true;
    }
  });

  console.log("starting server on port " + (process.env.PORT || 3000));
  app.listen(process.env.PORT || 3000);
  console.log("server started " + (process.env.PORT || 3000));

}





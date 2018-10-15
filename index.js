'use strict';

var express  = require('express'),
bodyParser   = require('body-parser'),
http         = require('http'),
config       = require('./Config'),
server       = express(),
mongoose     = require('mongoose'),
TeamInfo     = require('./API/Models/TeamInfo'), //created model loading here
GameSchedule = require('./API/Models/GameSchedule');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(config.dbUrl);

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

var routes = require('./API/Routes/Router'); //importing route
routes(server); //register the route

server.listen((process.env.PORT || 8000), function () {
	console.log("Server is up and listening on port" + process.env.PORT);
});

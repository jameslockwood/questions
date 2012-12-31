var sys = require('sys');
var express = require('express');
var server = require('./controllers/MasterController.js');

console.log("starting");

server.startup();  
console.log("started");


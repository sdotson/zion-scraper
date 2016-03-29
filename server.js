var schedule = require('node-schedule');
var express = require('express');
var app = express();

var Result = require('./models/Result');

var checkZion = require('./checkZion');


var crontab = require('node-crontab');
var jobId = crontab.scheduleJob("*/30 * * * *", function(){ //This will call this function every 2 minutes 
    console.log("It's been 30 minutes. Running checkZion...");
    checkZion.run();
});

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/zion');

app.get("/logs", function(req, res) {
	Result.find(function(err, results) {
	  if (err) return console.error(err);
		res.json(results);
	});
});

app.get("/logs/last", function(req, res) {
	Result.find().sort('-created_at').limit(1).exec(function(err, results){
	    res.json(results);
	});
});

app.get("/logs/first", function(req, res) {
	Result.find().sort('+created_at').limit(1).exec(function(err, results){
	    res.json(results);
	});
});

app.get("/logs/last10", function(req, res) {
	Result.find().sort('-created_at').limit(10).exec(function(err, results){
	    res.json(results);
	});
});

app.listen(3000);
console.log('Starting server on port 3000');

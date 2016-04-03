'use strict';

const schedule = require('node-schedule'),
	express = require('express'),
	app = express(),
	mongoose = require('mongoose'),
	Result = require('./models/Result'),
	checkZion = require('./checkZion'),
	j = schedule.scheduleJob('*/15 * * * *', function(){
	  console.log('15 minutes have passed. Running checkZion script...');
	  checkZion.run();
	});

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

app.get("/logs/cancellations", function(req, res) {
	Result.find({ cancellationDetected: true }).sort('-created_at').limit(10).exec(function(err, results){
	    res.json(results);
	});
});

app.get("/logs/cancellations/last", function(req, res) {
	Result.find({ cancellationDetected: true }).sort('-created_at').limit(1).exec(function(err, results){
	    res.json(results);
	});
});

app.listen(3000);
console.log('Starting server on port 3000');

var schedule = require('node-schedule');
var express = require('express');
var app = express();

var Result = require('./models/Result');

var checkZion = require('./checkZion');

var j = schedule.scheduleJob('*/30 * * * *', function(){
  checkZion();
  console.log('checkZion() ran.');
});

app.get("/logs/all", function(req, res) {
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

app.get("/logs/last10", function(req, res) {
	Result.find().sort('-created_at').limit(10).exec(function(err, results){
	    res.json(results);
	});
});

app.listen(3000);
console.log('Starting server on port 3000');

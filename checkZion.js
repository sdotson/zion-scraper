var spawn = require('child_process').spawn;
var casperChild = spawn('casperjs', ['casperTasks.js']);
var mongoose = require('mongoose');
var emails = require('./lib/emails');
var Result = require('./models/Result');

var casperOutput = '';

function runCasperTasks() { 
  casperChild.stdout.on('data', function (data) {
      casperOutput += data.toString();
  });

  casperChild.stdout.on('end', function () {
      var resultsObj = JSON.parse(casperOutput),
          twoHoursAgo = new Date(new Date().getTime() - 7200000), // two hours ago
          cancellationDetected = false;

      if (resultsObj.narrows.available.length || resultsObj.watchman.available.length) {
          Result.find({ cancellationDetected: true }).where('created_at').gt(twoHoursAgo).exec(function(err, results) {
            if (err) throw err;

            if (!results.length) {
              emails.sendEmail(resultsObj);
            }
          });
          cancellationDetected = true;
      } else {
          console.log('No new cancellations detected.');
      }

      var newResult = Result({
        cancellationDetected: cancellationDetected,
        results: resultsObj,
        created_at: new Date()
      });

      newResult.save(function(err) {
        if (err) throw err;
        console.log('CasperJS result logged!');
        mongoose.disconnect();
      });
  });
}


module.exports = runCasperTasks;


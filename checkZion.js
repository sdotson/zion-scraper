var spawn = require('child_process').spawn;
var casperChild = spawn('casperjs', ['casperTasks.js']);
var mongoose = require('mongoose');
var emails = require('./lib/emails');
var Result = require('./models/Result');

var casperOutput = '';

casperChild.stdout.on('data', function (data) {
    casperOutput += data.toString();
});

casperChild.stdout.on('end', function () {
    console.log(casperOutput);
    var resultsObj = JSON.parse(casperOutput),
        cancellationDetected = false;

    if (resultsObj.narrows.available.length || resultsObj.watchman.available.length) {
        emails.sendEmail(resultsObj);
        cancellationDetected = true;
    } else {
        console.log('No new cancellations detected.');
    }

    var newResult = Result({
      cancellationDetected: false,
      results: resultsObj,
      created_at: new Date()
    });

    newResult.save(function(err) {
      if (err) throw err;
      console.log('Result created!');
      mongoose.disconnect();
    });

    /*Result.find({}, function(err, results) {
      if (err) throw err;
      console.log(results);
    });*/

});





var spawn = require('child_process').spawn;
var casperChild = spawn('casperjs', ['casperTasks.js']);
var emails = require('./lib/emails');

var result = '';

casperChild.stdout.on('data', function (data) {
    result += data.toString();
});

casperChild.stdout.on('end', function () {
	console.log(result);
    var resultsObj = JSON.parse(result);

    if (resultsObj.narrows.available.length || resultsObj.watchman.available.length) {
        emails.sendEmail(resultsObj);
    } else {
        console.log('no new cancellations detected.');
    }

});



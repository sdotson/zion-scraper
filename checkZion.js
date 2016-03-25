var spawn = require('child_process').spawn;
var casperChild = spawn('casperjs', ['casperTasks.js']);

var result = '';

function sendAlert(thing) {
	console.log('Available permits/reservations have been detected for ' + thing);
}

casperChild.stdout.on('data', function (data) {
    result += data.toString();
});

casperChild.stdout.on('end', function () {
	console.log(result);
    var resultsObj = JSON.parse(result);

    if (resultsObj.narrows.available.length) {
    	sendAlert('narrows');
    }

    if (resultsObj.watchman.available.length) {
    	sendAlert('watchman');
    }

});



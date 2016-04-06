'use strict';

function runCasperTasks() {
    const mongoose = require('mongoose'),
        Result = require('./models/Result'),
        emails = require('./lib/emails'),
        spawn = require('child_process').spawn,
        casperChild = spawn('casperjs', ['casperTasks.js', '--ignore-ssl-errors=true']);

    let casperOutput = '';

    casperChild.stdout.on('data', function (data) {
        casperOutput += data.toString();
    });

    casperChild.stdout.on('end', function () {
        const resultsObj = JSON.parse(casperOutput),
            twoHoursAgo = new Date(new Date().getTime() - 7200000); // two hours ago

        let cancellationDetected = false;

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

        let newResult = Result({
            cancellationDetected: cancellationDetected,
            results: resultsObj,
            created_at: new Date()
        });

        newResult.save(function(err) {
            if (err) throw err;
            console.log('CasperJS result logged in MongoDB!');
        });
    });
}


module.exports = {
    run: runCasperTasks
};

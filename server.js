var spawn = require('child_process').spawn;

var casperChild = spawn('casperjs', ['app.js']);

var result = '';

casperChild.stdout.on('data', function (data) {
    result += data.toString();
});

casperChild.stdout.on('end', function () {
    process.stdout.write(result);
});

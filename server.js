var schedule = require('node-schedule');
var checkZion = require('./checkZion');


var j = schedule.scheduleJob('*/30 * * * *', function(){
  console.log('The answer to life, the universe, and everything!');
  checkZion();
});

var mongoose = require('mongoose');

process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
}); 

var Schema = mongoose.Schema;

var resultSchema = new Schema({
  results: Object,
  cancellationDetected: Boolean,
  created_at: Date,
});

var Result = mongoose.model('Result', resultSchema);

module.exports = Result;

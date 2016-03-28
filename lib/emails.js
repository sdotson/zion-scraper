var SparkPost = require('sparkpost');
var sp = new SparkPost('820fc869b7f3be37f78c6b67dcc4b6447466912b');

function sendEmail(data) {
	var message = '';

	if (data.narrows.unavailable.length) {
		message += '<h3>Cancellations have been detected for the Narrows Overnight Hike for the following days:</h3>';
		data.narrows.unavailable.forEach(function(site) {
			message += '<p><strong>' + site.siteName + '</strong> (' + site.days.length + ')<br><ul>';
			site.days.forEach(function(day) {
				message += '<li>May ' + day.dayNumber + ' (' + day.slotsAvailable + ' slots available)</li>';
			});
			message += '</ul></p>';
		});
	}

	if (data.watchman.unavailable.length) {
		message += '<h3>Cancellations have been detected for Watchman Campground for the following days:</h3>';
		message += '<ul>';
		data.watchman.unavailable.forEach(function(day) {
			message += '<li><strong>' + day.day.arrival + ' - ' + day.day.departure + '</strong><br>';
			message +=  day.tentOnly +  ' tents, ' + day.walkTo + ' walk-to</li>';
		});
		message += '</ul>';
	}

	/* send email */
	sp.transmissions.send({
	  transmissionBody: {
	    content: {
	      from: 'admin@stuartdotson.com',
	      subject: 'Zion Alert!',
	      html:'<html><body>' + message + '</body></html>'
	    },
	    recipients: [
	      {address: 'stu.dotson@gmail.com'}
	    ]
	  }
	}, function(err, res) {
	  if (err) {
	    console.log('Whoops! Something went wrong');
	    console.log(err);
	  } else {
	    console.log('Woohoo! You just sent your first mailing!');
	  }
	});
}

var emails = {
	sendEmail: sendEmail
};

module.exports = emails;

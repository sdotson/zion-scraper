var SparkPost = require('sparkpost');
var sp = new SparkPost('820fc869b7f3be37f78c6b67dcc4b6447466912b');

function sendEmail(data) {
	var message = '';

	if (data.narrows.available.length) {
		message += '<h3>Cancellations have been detected for the Narrows Overnight Hike for the following days:</h3>';
		message +='<p>Visit <a href="https://zionpermits.nps.gov/wilderness.cfm?TripTypeID=1">https://zionpermits.nps.gov/wilderness.cfm?TripTypeID=1</a> to get the permits</p>';
		data.narrows.available.forEach(function(site) {
			message += '<p><strong>' + site.siteName + '</strong> (' + site.daysAvailable.length + ')<br><ul>';
			site.daysAvailable.forEach(function(day) {
				message += '<li>May ' + day.dayNumber + ' (' + day.slotsAvailable + ' slots available)</li>';
			});
			message += '</ul></p>';
		});
	}

	if (data.watchman.available.length) {
		message += '<h3>Cancellations have been detected for Watchman Campground for the following days:</h3>';
		message +='<p>Visit <a href="http://www.recreation.gov/campsiteFilterAction.do?sitefilter=TENT%20ONLY%20NONELECTRIC&startIdx=0&contractCode=NRSO&parkId=70923">http://www.recreation.gov/campsiteFilterAction.do?sitefilter=TENT%20ONLY%20NONELECTRIC&startIdx=0&contractCode=NRSO&parkId=70923</a> to reserve the sites.</p>';
		message += '<ul>';
		data.watchman.available.forEach(function(day) {
			message += '<li><strong>' + day.day.arrival + ' - ' + day.day.departure + '</strong><br>';
			message +=  day.tentOnly +  ' tents, ' + day.walkTo + ' walk-to</li>';
		});
		message += '</ul>';
	}

	if (data.buckskin.available.length) {
		message += '<h3>Cancellations have been detected for the Buckskin Overnight Hike for the following days:</h3>';
		message +='<p>Visit <a href="https://www.blm.gov/az/paria/hikingcalendar.cfm?areaid=3">https://www.blm.gov/az/paria/hikingcalendar.cfm?areaid=3</a> to get the permits</p>';
		data.buckskin.available.forEach(function(site) {
			message += '<p><strong>' + site.siteName + '</strong> (' + site.daysAvailable.length + ')<br><ul>';
			site.daysAvailable.forEach(function(day) {
				message += '<li>May ' + day.dayNumber + ' (' + day.slotsAvailable + ' slots available)</li>';
			});
			message += '</ul></p>';
		});
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
	    console.log('Whoops! Something went wrong with sending the email.');
	    console.log(err);
	  } else {
	    console.log('Woohoo! A cancellation was detected and an email was sent.');
	  }
	});
}

var emails = {
	sendEmail: sendEmail
};

module.exports = emails;

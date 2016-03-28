function sendEmail(data) {
	var message = '';

	if (data.narrows.unavailable.length) {
		message += 'Cancellations have been detected for the Narrows Overnight Hike for the following days:\r\n\r\n';
		data.narrows.unavailable.forEach(function(site) {
			message += site.siteName + ' (' + site.days.length + ')\r\n';
			site.days.forEach(function(day) {
				message += '* May ' + day.dayNumber + ' (' + day.slotsAvailable + ' slots available)\r\n';
			});
			message += '\r\n\r\n';
		});
	}

	if (data.watchman.unavailable.length) {
		message += 'Cancellations have been detected for Watchman Campground for the following days:\r\n\r\n';
		data.watchman.unavailable.forEach(function(day) {
			message += day.day.arrival + ' - ' + day.day.departure + '\r\n';
			message +=  day.tentOnly +  ' tents, ' + day.walkTo + ' walk-to\r\n\r\n';
		});
	}

	console.log(message);
}

var emails = {
	sendEmail: sendEmail
};

module.exports = emails;

function getMonthTableSelector() {
	var currentMonth = parseInt(new Date().getMonth(),10),
		monthTableSelector;

	if (currentMonth === 3) {
		monthTableSelector = '#content table:nth-of-type(2) tr:nth-of-type(1) td:nth-of-type(2) table';
	} else if (currentMonth === 4) {
		monthTableSelector = '#content table:nth-of-type(2) tr:nth-of-type(1) td:nth-of-type(1) table';
	}

	return monthTableSelector;
}

function getAvailability(monthTableSelector) {
    var daySelector = monthTableSelector + ' tr:nth-of-type(6) td',
	    rows = document.querySelectorAll(daySelector),
	    jobs = [];

    for (var i = 0; i < rows.length; i++) {
        var span = rows[i].querySelector('span,a'),
	        p = rows[i].querySelector('p a, p'),
	        job = {};

        job['dayNumber'] = span.innerText;
        job['slotsAvailable'] = p.innerText === 'none' ? 0 : p.innerText;
        jobs.push(job);
    }
    return jobs;
}

function getTheMonth(monthTableSelector) {
	var monthSelector = monthTableSelector + ' tr:first-child th span',
		month = document.querySelectorAll(monthSelector)[0];
		console.log(month);
	return month.innerText;
}

var hikes = {
	checkPermits: function() {
	    var monthTableSelector = getMonthTableSelector();
		var monthCaptured = casper.evaluate(getTheMonth, monthTableSelector);
		var days = casper.evaluate(getAvailability, monthTableSelector);
		var daysAvailable = days.filter(function(day) { return day.slotsAvailable > 0; });
		var site;

		results.buckskin.month = monthCaptured;

		site = {
			daysAvailable: daysAvailable,
			daysAll: days
		};

		if (daysAvailable.length) {
			results.buckskin.available.push(site);
		} else {
			results.buckskin.unavailable.push(site);
		}
		return results;
	}
}

module.exports = hikes;

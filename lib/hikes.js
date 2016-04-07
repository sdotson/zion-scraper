function getMonthTableSelector(fudge) {
	var currentMonth = parseInt(new Date().getMonth(),10),
		monthTableSelector;

	/* HTML structure varies depending on the number of months before month of interest */
	if (currentMonth === 2) {
		monthTableSelector = '#cs_idCell2x1x1 table tr:nth-of-type(' + (10 + fudge) + ') table';
	} else if (currentMonth === 3) {
		monthTableSelector = '#cs_idCell2x1x1 table tr:nth-of-type(' + (8 + fudge) + ') td:nth-of-type(2) table';
	} else if (currentMonth === 4) {
		monthTableSelector = '#cs_idCell2x1x1 table tr:nth-of-type(' + (8 + fudge) + ') td:nth-of-type(1) table';
	}

	return monthTableSelector;
}

function getAvailability(monthTableSelector) {
    var daySelector = monthTableSelector + ' tr:nth-of-type(6) td',
	    rows = document.querySelectorAll(daySelector),
	    jobs = [];

    for (var i = 0; i < rows.length; i++) {
        var span = rows[i].querySelector('span,a'),
	        p = rows[i].querySelector('p'),
	        job = {};

        job['dayNumber'] = span.innerText;
        job['slotsAvailable'] = p.innerText;
        jobs.push(job);
    }
    return jobs;
}

function getTheMonth(monthTableSelector) {
	var monthSelector = monthTableSelector + ' tr:first-child th',
		month = document.querySelectorAll(monthSelector)[0];
	return month.innerText;
}

function getSiteName() {
	var name = document.querySelectorAll('#cs_idCell2x1x1 table tr:nth-of-type(6) strong')[0];
	return name.innerText;
}

var hikes = {
	checkPermits: function(options) {

		options.permits.forEach(function(campsite) {
			casper.waitForSelector('#chgresourceform', function() {
				this.fill('form#chgresourceform', {
			        'ResourceID' : campsite
			    }, true);
			})
			.waitForSelector("#cs_idCell2x1x1 table tr table", function () {
			    var monthTableSelector = getMonthTableSelector(0),
				    monthCaptured = this.evaluate(getTheMonth, monthTableSelector),
				    siteName = this.evaluate(getSiteName),
				    fudge,
				    site,
				    days,
				    daysAvailable;

				fudge = monthCaptured !== 'May 2016' ? 2 : 0;

				monthTableSelector = getMonthTableSelector(fudge);
				monthCaptured = this.evaluate(getTheMonth, monthTableSelector);
				days = this.evaluate(getAvailability, monthTableSelector);
				daysAvailable = days.filter(function(day) { return day.slotsAvailable > 0; });

				results[options.label].month = monthCaptured;

				site = {
					siteName: siteName,
					daysAvailable: daysAvailable,
					daysAll: days
				};

				if (daysAvailable.length) {
					results[options.label].available.push(site);
				} else {
					results[options.label].unavailable.push(site);
				}
			});
		});
		return results;
	}
}

module.exports = hikes;

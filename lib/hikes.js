function getAvailability() {
    var rows = document.querySelectorAll('#cs_idCell2x1x1 table tr:nth-of-type(10) table tr:nth-of-type(6) td');
    var jobs = [];
    for (var i = 0; i < rows.length; i++) {
        var span = rows[i].querySelector('span');
        var p = rows[i].querySelector('p');
        var job = {};
        job['dayNumber'] = span.innerText;
        job['slotsAvailable'] = p.innerText;
        jobs.push(job);
    }
    return jobs;
}

function getTheMonth() {
	var month = document.querySelectorAll('#cs_idCell2x1x1 table tr:nth-of-type(10) table tr:first-child th')[0];
	return month.innerText;
}

function getSiteName() {
	var name = document.querySelectorAll('#cs_idCell2x1x1 table tr:nth-of-type(6) strong')[0];
	return name.innerText;
}

var hikes = {
	checkPermits: function(options) {
		var that = this;

		options.permits.forEach(function(campsite) {

			casper.waitForSelector('#chgresourceform', function() {
				this.fill('form#chgresourceform', {
			        'ResourceID' : campsite
			    }, true);
			});

			casper.waitForSelector("#cs_idCell2x1x1 table tr table", function () {
			    var days = this.evaluate(getAvailability),
				    monthCaptured = this.evaluate(getTheMonth),
				    siteName = this.evaluate(getSiteName),
				    daysAvailable = days.filter(function(day) { return day.slotsAvailable > 0; });

				results[options.label].month = monthCaptured;

				site = {
					siteName: siteName,
					daysAvailable: daysAvailable,
					days: days
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

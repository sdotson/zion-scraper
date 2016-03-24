var util = require('util');
var casper = require('casper').create({
	pageSettings: {
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:23.0) Gecko/20130404 Firefox/23.0",
        webSecurityEnabled: false
    }
});

var campsites = require('./lib/campsites');

var narrowsUrl = 'https://zionpermits.nps.gov/wilderness.cfm?TripTypeID=1';

var narrowsSites = ['30027001','30027003','30027005', '30027007', '30027009', '30027012'];

var watchmanUrl = 'http://www.recreation.gov/campsiteFilterAction.do?sitefilter=TENT%20ONLY%20NONELECTRIC&startIdx=0&contractCode=NRSO&parkId=70923';
var watchmanDates = [
	{
		arrival: 'Sun May 22 2016',
		departure: 'Mon May 23 2016'
	},
	{
		arrival: 'Mon May 23 2016',
		departure: 'Tue May 24 2016'
	},
	{
		arrival: 'Tue May 24 2016',
		departure: 'Wed May 25 2016'
	}
];

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

var results = {
	narrows: {
		available: [],
		unavailable: []
	},
	watchman: {
		available: [],
		unavailable: []
	}
};

function checkPermits(options) {

	options.permits.forEach(function(campsite) {

		casper.waitForSelector('#chgresourceform', function() {
			this.fill('form#chgresourceform', {
		        'ResourceID' : campsite
		    }, true);
		});

		casper.waitForSelector("#cs_idCell2x1x1 table tr table", function () {
		    var days = this.evaluate(getAvailability);

		    var monthCaptured = this.evaluate(getTheMonth);

		    var siteName = this.evaluate(getSiteName);

		    var daysAvailable = days.filter(function(day) { return day.slotsAvailable > 0; });

			results[options.label].monthCaptured = monthCaptured;

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

casper.start(narrowsUrl)
	.then(function() {
		return checkPermits({permits: narrowsSites,label: 'narrows'});
	})
	.thenOpen(watchmanUrl)
	.then(function() {
		return campsites.checkAvailability(watchmanDates);
	});


casper.run(function() {
	this.echo('Raw results');
	this.echo('-------------------------------');

	this.echo(util.inspect(results, {showHidden: false, depth: 7}));
	this.echo('-------------------------------');
	if (results.narrows.available.length) {
		this.echo('Congratulations! There are spots available for the Zion Narrows Top Down Hike!');
	} else {
		this.echo('Unfortunately, there are no spots available for the Zion Narrows Top Down Hike.');
	}
	if (results.watchman.available.length) {
		this.echo('Congratulations! There are spots available for the Watchman Campground!');
	} else {
		this.echo('Unfortunately, there are no spots available for the Watchman Campground.');
	}
});

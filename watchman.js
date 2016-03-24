var util = require('util');
var casper = require('casper').create({
	pageSettings: {
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:23.0) Gecko/20130404 Firefox/23.0",
        webSecurityEnabled: false
    }
});

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

function getTentSpaces() {
	var tentOnly = document.querySelectorAll('.searchSummary .filters > div:nth-of-type(3) a')[0];
	var walkTo = document.querySelectorAll('.searchSummary .filters > div:nth-of-type(4) a')[0];

	return {
		tentOnly: parseInt(tentOnly.title.slice(0,1),10), 
		walkTo: parseInt(walkTo.title.slice(0,1),10)
	};
}

function checkCampsites(dates) {
	dates.forEach(function(day) {
		casper.waitForSelector('#unifSearchForm', function() {
			this.fill('form#unifSearchForm', {
				lookingFor: '3100',
		        arrivalDate: day.arrival,
		        departureDate: day.departure
		    }, true);    
		})
		.waitForResource('element.js', function() {
			/*this.echo(this.fetchText('.matchSummary'));*/
			var tentSpaces = this.evaluate(getTentSpaces);
			tentSpaces.day = day;

			if (tentSpaces.tentOnly > 0 || tentSpaces.WalkTo > 0) {
				results.watchman.available.push(tentSpaces);
			} else {
				results.watchman.unavailable.push(tentSpaces);
			}
		});		
	});
}

casper.start(watchmanUrl)
	.then(function() {
		checkCampsites(watchmanDates);
	})
	.then(function() {
		this.echo('Raw results');
		this.echo('-------------------------------');

		this.echo(util.inspect(results, {showHidden: false, depth: 5}));
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

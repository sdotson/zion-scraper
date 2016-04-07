var casper = require('casper').create({
		pageSettings: {
	        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:23.0) Gecko/20130404 Firefox/23.0",
	        webSecurityEnabled: false,
	        loadImages:  false,
	    }/*,
	    verbose: true,
	    logLevel: "debug"*/
	}),
	campsites = require('./lib/campsites'),
	hikes = require('./lib/hikes'),
	blmhikes = require('./lib/blmhikes'),
	narrowsUrl = 'https://zionpermits.nps.gov/wilderness.cfm?TripTypeID=1',
	narrowsSites = ['30027001','30027003','30027005', '30027007', '30027009', '30027012'],
	watchmanUrl = 'http://www.recreation.gov/campsiteFilterAction.do?sitefilter=TENT%20ONLY%20NONELECTRIC&startIdx=0&contractCode=NRSO&parkId=70923',
	watchmanDates = [
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
	],
	buckskinUrl = 'https://www.blm.gov/az/paria/hikingcalendar.cfm?areaid=3',
	results = {
		narrows: {
			available: [],
			unavailable: []
		},
		watchman: {
			available: [],
			unavailable: []
		},
		buckskin: {
			available: [],
			unavailable: []
		},
		lastRun: new Date().toString()
	};

casper.start(narrowsUrl)
	.then(function() {
		return hikes.checkPermits({permits: narrowsSites,label: 'narrows'});
	})
	.thenOpen(watchmanUrl)
	.then(function() {
		return campsites.checkAvailability(watchmanDates);
	})
	.thenOpen(buckskinUrl)
	.then(function() {
		return blmhikes.checkPermits();
	});

casper.run(function() {
	this.echo(JSON.stringify(results));
	this.exit();
});

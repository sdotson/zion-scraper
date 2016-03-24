var campsites = {
	getTentSpaces: function() {
		var tentOnly = document.querySelectorAll('.searchSummary .filters > div:nth-of-type(3) a')[0];
		var walkTo = document.querySelectorAll('.searchSummary .filters > div:nth-of-type(4) a')[0];

		return {
			tentOnly: parseInt(tentOnly.title.slice(0,1),10), 
			walkTo: parseInt(walkTo.title.slice(0,1),10)
		};
	},
	init: function(url) {

	},
	checkAvailability: function(dates) {
		var that = this;

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
				var tentSpaces = this.evaluate(that.getTentSpaces);
				tentSpaces.day = day;

				if (tentSpaces.tentOnly > 0 || tentSpaces.WalkTo > 0) {
					results.watchman.available.push(tentSpaces);
				} else {
					results.watchman.unavailable.push(tentSpaces);
				}
			});		
		});
	}
}

module.exports = campsites;

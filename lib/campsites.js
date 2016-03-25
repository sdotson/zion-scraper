function getTentSpaces() {
	var tentOnly = document.querySelectorAll('.searchSummary .filters > div:nth-of-type(3) a')[0];
	var walkTo = document.querySelectorAll('.searchSummary .filters > div:nth-of-type(4) a')[0];

	return {
		tentOnly: parseInt(tentOnly.title.slice(0,1),10), 
		walkTo: parseInt(walkTo.title.slice(0,1),10)
	};
}

var campsites = {
	checkAvailability: function(dates) {
		var that = this;

		var theseResults = {
			available: [],
			unavailable: []
		};

		dates.forEach(function(day) {
			casper.reload()
				.waitForSelector('#unifSearchForm', function() {
					this.fill('form#unifSearchForm', {
						lookingFor: '3100',
				        arrivalDate: day.arrival,
				        departureDate: day.departure
				    }, true);    
				})
				.waitForResource('element.js', function() {
					var tentSpaces = this.evaluate(getTentSpaces);
					tentSpaces.day = day;

					if (tentSpaces.tentOnly > 0 || tentSpaces.WalkTo > 0) {
						theseResults.available.push(tentSpaces);
						results.watchman.available.push(tentSpaces);
					} else {
						theseResults.unavailable.push(tentSpaces);
						results.watchman.unavailable.push(tentSpaces);
					}
				});		
		});
	}
}

module.exports = campsites;

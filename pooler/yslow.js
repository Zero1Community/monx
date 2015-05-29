var phantom = require('phantom');
phantom.create(function(ph) {
	return ph.createPage(function(page) {
		return page.open("http://www.google.com", function(status) {
			console.log("opened google? ", status);
			return page.evaluate((function() {
				return document.title;
			}), function(result) {
				console.log('Page title is ' + result);
				return ph.exit();
			});
		});
	});
});

	


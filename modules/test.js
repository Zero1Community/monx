var dns = require('dns');
dns.resolve4('79.106.109.159', 1, function (err, domain) {
	    if(err) {
	        //console.log(err);
	        console.log('not listed.');
	    }
	    else {
	        console.log(' LISTED!');
	    }
});
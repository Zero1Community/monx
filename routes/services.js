var express = require('express');
var router = express.Router();
var dns = require('dns');

router.post('/mx', function(req, res){
	"use strict";
	var domain = req.body.domain;
	dns.resolveMx(domain, function(error, addr) {

		if(error) {
			console.log(error);
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify({'success': 0, 'message': 'No mx records'}));
		} else {
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(addr));
		}
	});
});

router.post('/blacklist', function(req, res){
	var ip_domain = req.body.ip;
	console.log(ip_domain);
	function flipIP(ip) {
		return ip.split('.').reverse().join('.');
	}

var servers = [
	'access.redhawk.org',
	'b.barracudacentral.org',
	'bl.shlink.org',
	'bl.spamcannibal.org',
	'bl.spamcop.net',
	'bl.tiopan.com',
	'blackholes.wirehub.net',
	'blacklist.sci.kun.nl',
	'block.dnsbl.sorbs.net',
	'blocked.hilli.dk',
	'bogons.cymru.com',
	'cart00ney.surriel.com',
	'cbl.abuseat.org',
	'cblless.anti-spam.org.cn',
	'dev.null.dk',
	'dialup.blacklist.jippg.org',
	'dialups.mail-abuse.org',
	'dialups.visi.com',
	'dnsbl.abuse.ch',
	'dnsbl.anticaptcha.net',
	'dnsbl.antispam.or.id',
	'dnsbl.dronebl.org',
	'dnsbl.justspam.org',
	'dnsbl.kempt.net',
	'dnsbl.sorbs.net',
	'dnsbl.tornevall.org',
	'dnsbl-1.uceprotect.net',
	'duinv.aupads.org',
	'dnsbl-2.uceprotect.net',
	'dnsbl-3.uceprotect.net',
	'dul.dnsbl.sorbs.net',
	'dul.ru',
	'escalations.dnsbl.sorbs.net',
	'hil.habeas.com',
	'black.junkemailfilter.com',
	'http.dnsbl.sorbs.net',
	'intruders.docs.uu.se',
	'ips.backscatterer.org',
	'korea.services.net',
	'l2.apews.org',
	'mail-abuse.blacklist.jippg.org',
	'misc.dnsbl.sorbs.net',
	'msgid.bl.gweep.ca',
	'new.dnsbl.sorbs.net',
	'no-more-funn.moensted.dk',
	'old.dnsbl.sorbs.net',
	'opm.tornevall.org',
	'pbl.spamhaus.org',
	'proxy.bl.gweep.ca',
	'dyna.spamrats.com',
	'spam.spamrats.com',
	'psbl.surriel.com',
	'pss.spambusters.org.ar',
	'rbl.schulte.org',
	'rbl.snark.net',
	'recent.dnsbl.sorbs.net',
	'relays.bl.gweep.ca',
	'relays.bl.kundenserver.de',
	'relays.mail-abuse.org',
	'relays.nether.net',
	'rsbl.aupads.org',
	'sbl.spamhaus.org',
	'smtp.dnsbl.sorbs.net',
	'socks.dnsbl.sorbs.net',
	'spam.dnsbl.sorbs.net',
	'spam.olsentech.net',
	'spamguard.leadmon.net',
	'spamsources.fabel.dk',
	'tor.ahbl.org',
	'tor.dnsbl.sectoor.de',
	'ubl.unsubscore.com',
	'web.dnsbl.sorbs.net',
	'xbl.spamhaus.org',
	'zen.spamhaus.org',
	'zombie.dnsbl.sorbs.net',
	'dnsbl.inps.de',
	'dyn.shlink.org',
	'rbl.megarbl.net',
	'bl.mailspike.net'
	];

	var result;

	servers.forEach(function(host){
		var ip = flipIP(ip_domain) + host;
		//console.log(ip);
		 dns.resolve4(ip, function (err, domain) {
		    if(err) {
		        //console.log(err);
		        //console.log(host +' not listed.');
		 		result += host +' not listed.<br>';
		    }
		    else {
		        console.log(host +' LISTED!');
		        result += host +' LISTED!<br>';
		    }
		});
	});
	res.end(result);
});

module.exports = router;

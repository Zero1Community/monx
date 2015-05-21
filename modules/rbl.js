var dns = require('dns');
var async = require('async');

function flipIP(ip) {
	var ip = ip.split('.').reverse().join('.');
	//console.log(ip);
	return ip;
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
	'bl.mailspike.net',
	'aspews.ext.sorbs.net',
	'list.blogspambl.com',
	'dnsbl.burnt-tech.com',
	'tor.dan.me.uk',
	'torexit.dan.me.uk',
	'rbl.dns-servicios.com',
	'bl.drmx.org',
	'rbl.efnetrbl.org',
	'dnsrbl.swinog.ch',
	'lists.dsbl.org',
	'rbl.megarbl.net',
	'z.mailspike.net',
	'bl.mailspike.net',
	'dnsbl.madavi.de ',
	'ubl.lashback.com',
	'combined.rbl.msrbl.net',
	'images.rbl.msrbl.net',
	'virus.rbl.msrbl.net',
	'spam.rbl.msrbl.net',
	'phishing.rbl.msrbl.net',
	'orvedb.aupads.org',
	'0spamtrust.fusionzero.com',
	'in-adr.myfasttelco.com'
	];

var blacklistCheck = function (ip, timeout, callback) {
	var callbackCalled = false;
	var doCallback = function(err, domains) {
		if (callbackCalled) {
			return;
		} 
		callbackCalled = true;
		callback(err, domains);
	};

	setTimeout(function() {
		doCallback(new Error("Timeout exceeded"), null);
	}, timeout);

	dns.resolve(ip, doCallback);
}

/*async.each(servers, function(server){
	//console.log(server);
		var ip = flipIP('64.233.168.26') + server;
		blacklistCheck(ip, 5000, function(err, addresses) {
		if (err) {
			console.log(err + " on -> " + server);
			return;
		}
		console.log(addresses + " on -> " + server);
		});
});*/

// assuming openFiles is an array of file names 

/*async.each(servers, function(server) {

  // Perform operation on file here.
  console.log('Processing file ' + server);	

}, function(err){
    // if any of the file processing produced an error, err would equal that error
    if( err ) {
      // One of the iterations produced an error.
      // All processing will now stop.
      console.log('A file failed to process');
    } else {
      console.log('All files have been processed successfully');
    }
});*/


var doSomethingOnceAllAreDone = function(){
	console.log('done al!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!l!');
}

async.each(servers,
  // 2nd param is the function that each item is passed to
  function(item){
    // Call an asynchronous function, often a save() to DB

    console.log(item );
  },
  // 3rd param is the function to call when everything's done
  function(err){
    // All tasks are done now
    doSomethingOnceAllAreDone();
  }
);
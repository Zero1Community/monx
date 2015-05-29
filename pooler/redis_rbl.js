
var start = Date.now();

var redis = require("redis"),
		client = redis.createClient();

// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });

client.on("error", function (err) {
		console.log("Error " + err);
		// nqs ska redis a kupto
});
var servers = [
  'spam.spamrats.com',
  'psbl.surriel.com',
  'pss.spambusters.org.ar',
  'rbl.schulte.org',
  'rbl.snark.net',
  'recent.dnsbl.sorbs.net',
  'relays.bl.gweep.ca',
  'relays.bl.kundenserver.de',
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
  'in-adr.myfasttelco.com',
  'access.redhawk.org',
  'b.barracudacentral.org',
  'bl.shlink.org',
  'bl.spamcannibal.org',
  'bl.spamcop.net',
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
  'dyna.spamrats.com'
 ];


//client.rpush.apply(client, ['servers'].concat(servers));

// ... or with a callback
// client.rpush.apply(client, ['servers'].concat(servers).concat(function(err, ok){
//   console.log(err, ok);
// }));

for(var i = servers.length - 1; i >= 0; i--) {
	client.set('servers', servers[i]);
};

client.hkeys("servers", function (err, replies) {
		if(err){
			console.log(err);
		}
		else{
			console.log(replies.length + " replies:");
			replies.forEach(function (reply, i) {
					console.log("    " + i + ": " + reply);
			});
			var delta = (Date.now()) - start;
			console.log(delta + " ms");				
		}
		client.quit();
});
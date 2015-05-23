var dns = require('native-dns');
var async = require('async');

var checkRBL = function(host, callback){

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



var results = [];
var default_timeout = 1000;
var ip_to_check;

var check_dns = function(rbl_server, doneCallback){

  var start = Date.now();
  var req = dns.Request({
    question: dns.Question({name: ip_to_check.split('.').reverse().join('.') + "." + rbl_server, type: 'A'}),
    server: { address: '208.67.222.222', port: 53, type: 'udp' },
    timeout: default_timeout,
  });

  req.on('timeout', function () {
    var delta = (Date.now()) - start;
    results.push({server: rbl_server, status : 2, res_time : delta});
  });

  req.on('message', function (err, answer) {
    if(answer.answer.length < 1){
        var delta = (Date.now()) - start;
        results.push({server: rbl_server, status : 0, res_time : delta});
    }
    else{
        var delta = (Date.now()) - start;
        results.push({server: rbl_server, status : 1, res_time : delta});
      };
  });

  req.on('end', function () {
    return doneCallback(null);
  });

  req.send();
}

host_to_scan(host, function(){
  async.each(servers, check_dns, function(err) {
    callback(results);
  });
});

}

function host_to_scan(host, callback) {

  if(!validateIp(host)) {
    dns.resolve4(host, function(error, addr) {
      if(error) {
        console.log('Error resolving', err);
      } else {
        console.log(addr);
        ip_to_check = addr[0];
      }
      callback();
  });
  } else {
    ip_to_check = host;
    callback();
  }
}

function validateIp(ip)   
{  
  if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip))  
  {  
    return true;
  }  
  return false;  
} 

module.exports = checkRBL;
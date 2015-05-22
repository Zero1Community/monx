// libs and shit 
var amqp = require('amqplib');

// dhe zoti tha: prit i her mos ta vejm direkt ne production 
var debug = 1;


var api_url = "http://monx.zero1.al/api/v1/services";
var API_POST_URL = "http://monx.zero1.al:31416/api/service_data";


// funx 1 nga 1 ktu
// objekti i tipit monitorim


// per tu shtu:
// web analysis per te identifiku sensoret automatikisht
// tipit 
// dns, web, match, snmpt,pop, etj..


//check if we have root

// SENSORET:
// http_load_time
// blacklist check

// # dom1.com 1
// # dom2.com 5

// [ 
// 0
// dom1
// 1
// dom1
// 2
// dom1
// 3
// dom1
// 4
// dom1 
// 5
// dom1
// dom2
// 6
// dom1
// 7
// dom1
// 8
// dom1
// 9
// dom1 
// dom2
// 10
// ]

//10 workers 

// duhen lidh callbaqet qe te mos ndodhin te gjithe njeheresh / ose jo :P 

amqp.connect('amqp://localhost').then(function(conn) {
  process.once('SIGINT', function() { conn.close(); });
  return conn.createChannel().then(function(ch) {
    
    var ok = ch.assertQueue('all_checks', {durable: false});
    
    ok = ok.then(function(_qok) {
      return ch.consume('all_checks', function(msg) {
        console.log(" [x] Received a task");
        // kemi objektin me vllai me gjonat mwena 
        var toCheck = JSON.parse(msg.content.toString());
        console.log(toCheck);
    	processWork(toCheck);
        //console.log(msg);
      }, {noAck: true});
    });

    return ok.then(function(_consumeOk) {
      console.log(' [*] Waiting for messages. To exit press CTRL+C');
    });
  });
}).then(null, console.warn);



processWork = function(tC,callback){
	if(tC.type === "smtp_check"){
		monxSmtp(tC);
	}
	if(tC.type === "pop_check"){
		monxPop(tC);
	}

	if(tC.type === "blacklist_check"){
		monxBlacklist(tC);
	}
	if(tC.type === "icmp_check"){
		//
	}

}



// posting data to API function
postToAPI = function(){
// postojm pra te api
}

// smtp_check
monxSmtp = function(smtpObject,callback){
	var net = require('net');
	//smtpObject.target = "127.0.0.1";
	//smtpObject.target_port = 25;
	var smtp_result = "";
	var start = Date.now();
	// per tu implementu timeouti
	var client = net.connect({hostname: smtpObject.host,port: smtpObject.port},function(){ //'connect' listener
			console.log('Sikur po lidhemi ');	//client.write('world!\r\n');
		//var delta = (Date.now()) - start;
			//smtp_result = "Connected ";
			//smtp_result += "Connection Time : "+ delta + " ms";
		});
	client.on("error", function(err) { 
		console.log("Unable to Connect");client.end();
		smtp_result = "Unable to Connect";
	});
	client.on("timeout", function(err) { 
		console.log("Connection Timeouted");client.end();
		smtp_result = "Connection Timeouted";
	});

	client.on('data', function(data) {
		//console.log(data.toString());
		smtp_result = "Got data :" + data.toString();
		client.end();
	});
	client.on('end', function() {
		var delta = (Date.now()) - start;
		//console.log('Disconnected from server. Session time: ' + delta + " ms");
		smtp_result += 'Disconnected from server. Session time: ' + delta + " ms";
		//callback(smtp_result);
		console.log(smtp_result);
	});
}

// pop_check
monxPop = function(popObject,callback){
	var net = require('net');
	var popResult = "";
	var start = Date.now();
	// per tu implementu timeouti
	var client = net.connect({hostname: popObject.host,port: popObject.port},function(){ //'connect' listener
			console.log('Sikur po lidhemi ');	//client.write('world!\r\n');
		//var delta = (Date.now()) - start;
			//smtp_result = "Connected ";
			//smtp_result += "Connection Time : "+ delta + " ms";
		});
	client.on("error", function(err) { 
		console.log("Unable to Connect");client.end();
		popResult = "Unable to Connect";
	});
	client.on("timeout", function(err) { 
		console.log("Connection Timeouted");client.end();
		popResult = "Connection Timeouted";
	});

	client.on('data', function(data) {
		//console.log(data.toString());
		popResult = "Got data :" + data.toString();
		client.end();
	});
	client.on('end', function() {
		var delta = (Date.now()) - start;
		//console.log('Disconnected from server. Session time: ' + delta + " ms");
		popResult += 'Disconnected from server. Session time: ' + delta + " ms";
		//callback(smtp_result);
		console.log(popResult);
	});
}

// blacklist module
monxBlacklist = function(blacklistObject,callback){
	var dns = require('native-dns');
	var async = require('async');

	if(debug){
		console.log("Checking blacklist for ip " + blacklistObject.ip);
	}

	var checkRBL = function(ip_to_check, callback){

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

	var check_dns = function(rbl_server, doneCallback){

	  var start = Date.now();
	  var req = dns.Request({
	    question: dns.Question({name: ip_to_check.split('.').reverse().join('.') + "." + rbl_server, type: 'A'}),
	    server: { address: '208.67.222.222', port: 53, type: 'udp' },
	    timeout: default_timeout,
	  });
	  if(debug){
	  	console.log(blacklistObject.ip.split('.').reverse().join('.') + "." + rbl_server);
	  }
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

	async.each(servers, check_dns, function(err) {
	  //callback(results);
	  console.log(results);
	});

	}
	checkRBL(blacklistObject.ip);
}

// http_status
monx_http_stat = function(url){
	var url = "http://arbl.zero1.al";
	var http = url.match(/^https/) ? require('https') : require('http');

	// nqs marrim statuscode 3XX (redirect) duhet ta ndjekim linkun ?
	// nqs po , 1 her
	// per gjona shtese aktivizojme ket
	//var options = {
	//	  host: ''
	//};

   
	http.request("http://www.zero1.al/", function(response) {
			//console.log(response.statusCode)
			
			switch(true){
				case ( response.statusCode >= 200 && response.statusCode< 300 ):
					console.log("GOT 200 CODE - OK");
				break;
				case (response.statusCode >= 300 && response.statusCode < 400 ):
					console.log("GOT 300 CODE - REDIRECT");
					break;
				case (response.statusCode >= 400 && response.statusCode < 500 ):
					console.log("GOT 400 CODE - CLIENT MESSED UP SOMETHING");
					break;
				case (response.statusCode >= 500 && response.statusCode < 600 ):
					console.log("GOT 500 CODE - SERVER MESSED UP SOMETHING");
					break;
				default:
					console.log("GOT INVALID STATUS CODE");
			}
			var str = '';

			//another chunk of data has been recieved, so append it to `str`
			response.on('data', function (chunk) {
					str += chunk;
			});

	  //the whole response has been recieved, so we just print it out here
			response.on('end', function () {
					// ktu duhet returni 
					//console.log(str);
			});
	}).end();
}

// http_match
monx_http_match = function(url){
	var url = "http://arbl.zero1.al";
	var http = url.match(/^https/) ? require('https') : require('http');

	// nqs marrim statuscode 3XX (redirect) duhet ta ndjekim linkun ?
	// nqs po , 1 her
	// per gjona shtese aktivizojme ket
	//var options = {
	//	  host: ''
	//};


	http.request(url, function(response) {
			//console.log(response.statusCode)
			
			switch(true){
				case ( response.statusCode >= 200 && response.statusCode< 300 ):
					console.log("GOT 200 CODE - OK");
				break;
				case (response.statusCode >= 300 && response.statusCode < 400 ):
					console.log("GOT 300 CODE - REDIRECT");
					break;
				case (response.statusCode >= 400 && response.statusCode < 500 ):
					console.log("GOT 400 CODE - CLIENT MESSED UP SOMETHING");
					break;
				case (response.statusCode >= 500 && response.statusCode < 600 ):
					console.log("GOT 500 CODE - SERVER MESSED UP SOMETHING");
					break;
				default:
					console.log("GOT INVALID STATUS CODE");
			}
			var str = '';

			//another chunk of data has been recieved, so append it to `str`
			response.on('data', function (chunk) {
					str += chunk;
			});

			response.on('end', function () {
					console.log( str.match(/eshte\sne\sBlacklist/g) ? "OK - FOUND" : "NOT FOUND" ); 
			});
	}).end();
}

// icmp_check
// duhet fut nje 1 sekondsh sleep per te shmangur floodin..
monx_ping = function(){
	var target = "8.8.8.8"
	var ping = require ("net-ping");
	var options = {
		retries: 1,
		timeout: 2000
		//timeout: parseInt(process.argv[3])
	};

	var ping_session = ping.createSession (options);

	ping_session.on ("error", function (error) {
		console.trace (error.toString ());
	});

	function p_check () {
		ping_session.pingHost (target, function (error, target,sent,rcvd) {
			var ms = rcvd - sent;
			if (error)
				if (error instanceof ping.RequestTimedOutError)
					console.log (target + ": Not alive");
				else
					console.log (target + ": " + error.toString ());
			else
				console.log (target + " OK " + "Pong Time:" + ms + " ms");
		},2000);
		//set timeout funcion here from main monx object
	}

	for (var i = 5; i >= 0; i--) {
		p_check();
	};	
}


// localSmtp = {
// 	target : "127.0.0.1",
// 	target_port : 25
// };

// monxSmtp(localSmtp,function(smtpRestult){
// 	console.log(smtpRestult);
// });

//retreive_configs()



// Procedura:
// 1 - do marrim configun nga webi
// 		nqs skapet webi kemi siklet
//		fallback te fajli local
// 			nqs fajli nuk gjendet  DIE 
// 2 - do e ruajm lokalisht (ramfs ?) JO!
// 3 - parsojme fajlin  ( pse ? eshte json wtf..)
// 4 - startojme eventin e monitorimit (ber e qaves)

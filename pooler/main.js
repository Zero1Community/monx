// libs and shit 
var amqp = require('amqplib');

// dhe zoti tha: prit i her mos ta vejm direkt ne production 
var debug = 1;

//var api_url = "http://monx.zero1.al/api/v1/services";
//var API_POST_URL = "http://monx.zero1.al:31416/api/service_data";

// per tu shtu:
// throttle (kjo behet ne vend tjeter faktikisht)

// web analysis per te identifiku sensoret automatikisht
// tipit 
// dns, web, match, snmpt,pop, etj..

// SMS, Twitter, Email , Makjato , Kafe..

//check if we have root
// duhen lidh callbaqet qe te mos ndodhin te gjithe njeheresh / ose jo :P 

amqp.connect('amqp://localhost').then(function(conn) {
  process.once('SIGINT', function() { conn.close(); });
  return conn.createChannel().then(function(ch) {
    
    var ok = ch.assertQueue('all_checks', {durable: false});
    // todo : error catching per kur nuk lidhet queueja 
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


// duhet nje seksion per analysis
// tipit blacklista, skano portat, shif ssl-ne

function processWork(tC,callback){
	if(tC.type === "smtp_check"){
		monxSmtp(tC);
	}
	if(tC.type === "imap_check"){
		//monxSmtp(tC);
	}
	if(tC.type === "pop_check"){
		monxPop(tC);
	}
	if(tC.type === "ftp_check"){
		//monxBlacklist(tC);
	}
	if(tC.type === "btc_price_check"){
		//monxBlacklist(tC);
	}
	if(tC.type === "cpannel_check"){
		//monxBlacklist(tC);
	}
	if(tC.type === "mobile_app_check"){
		//monxBlacklist(tC);
	}
	if(tC.type === "wordpress_ver_check"){
		//monxBlacklist(tC);
	}
	// if(tC.type === "snmp_check"){
	// 	//monxBlacklist(tC);
	// }	
	// if(tC.type === "ovpn_check"){
	// 	//monxBlacklist(tC);
	// }	
	// if(tC.type === "ipsec_check"){
	// 	//monxBlacklist(tC);
	// }	
	if(tC.type === "ssh_check"){
		//monxBlacklist(tC);
	}
	if(tC.type === "blacklist_check"){
		monxBlacklist(tC);
	}
	if(tC.type === "icmp_check"){
		//monxIcmpCheck(tc)
	}
	if(tC.type === "dns_status_check"){
		//monxDnsStatusCheck(tC)
	}
	if(tC.type === "dns_record_check"){
		// kjo gjeja me duhet mua
		//monxDnsStatusCheck(tC)
	}
	if(tC.type === "generic_routine_task_check"){
		// test
		//
	}
	if(tC.type === "dns_probpg_check"){
		// query per nje record neper servera te ndryshem
		// a eshte updatuar apo jo
		// me harte e me te gjitha
		// to-do: me gjet liste totale DNSsh sipas shteve psh
		//monxDnsPropagandationStatusCheck(tC);
	}
	if(tC.type === "http_load_time"){
		//monxHttpLoadTime(tC)
	}
	if(tC.type === "api_check"){
		// post i gjo custom dhe merr dicka custom
		//monxApiCheck(tC)
	}
	if(tC.type === "ssl_expiration_check"){
		//monxSslCheck(tC)
	}
	if(tC.type === "ssl_security_check"){
		//monxSslCheck(tC)
	}

}

// posting data to API function
postToAPI = function(){
// postojm pra te api
}

// smtp_check
function monxSmtp(smtpObject,callback){
	var net = require('net');
	//smtpObject.target = "127.0.0.1";
	//smtpObject.target_port = 25;
	console.log("Na erdhi ");
	console.log(smtpObject);
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
		console.log("Unable to Connect" + err);client.end();
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
function monxPop(popObject,callback){
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
function monxBlacklist(blacklistObject){
	var checkRBL = require('../modules/checkBlacklist.js');

	checkRBL(blacklistObject.host, function(results){
		console.log('Scan finished for: ' + blacklistObject.host);
		console.log(results);
		//API Login here
	});
}

// http_status
function monxHttpStat(statObject,callback){
	var http = url.match(/^https/) ? require('https') : require('http');
	var httpStatOutcome = "";
	// nqs marrim statuscode 3XX (redirect) duhet ta ndjekim linkun ?
	// nqs po , 1 her
	// per gjona shtese aktivizojme ket
	   
	http.request(statObject.url, function(response) {
			//console.log(response.statusCode)
			
			switch(true){
				case ( response.statusCode >= 200 && response.statusCode< 300 ):
					console.log("200 - OK");
					httpStatOutcome = "200 - OK";
				break;
				case (response.statusCode >= 300 && response.statusCode < 400 ):
					console.log("300 - Redirect");
					httpStatOutcome = "300 - Redirect";
					break;
				case (response.statusCode >= 400 && response.statusCode < 500 ):
					console.log("400 - Clilent Request Error / Invalid Request");
					httpStatOutcome = "400 - Clilent Request Error / Invalid Request";
					break;
				case (response.statusCode >= 500 && response.statusCode < 600 ):
					console.log("500- Internal Server Error");
					httpStatOutcome = "500- Internal Server Error";
					break;
				default:
					console.log("Invalid Status Code received from server " + response.statusCode);
					httpStatOutcome = "Invalid Status Code received from server "+ response.statusCode;
			}
			var str = '';
			response.on('error', function(){
				//error me ti 
				 console.log('problem with request: ' + e.message);
			});
			//another chunk of data has been recieved, so append it to `str`
			response.on('data', function (chunk) {
					str += chunk;
			});

	  //the whole response has been recieved, so we just print it out here
			response.on('end', function () {
					// ktu duhet callbacku
					//console.log(str);
			});
	}).end();
}

// http_match
function monx_http_match(matchObject,callback){
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
function monx_ping(){
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

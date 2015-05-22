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
}




retreive_configs = function(){
	var http = require('http');
	console.log(debug ? "Getting " + api_url : "");
	console.log(debug ? "Getting " + http : "");

	http.get(api_url, function(res) {
	    var body = '';
		console.log(debug ? "Getting " + res.statusCode + " as status code from API " : "");
	    
	    res.on('data', function(chunk) {
	        body += chunk;
	    });

	    res.on('end', function() {
	        var node_config = JSON.parse(body)
	        console.log("Got response: ", node_config);
	    });
	}).on('error', function(e) {
	      console.log("Got error: ", e);
	});
	//node_config ? console.log("Got JSON obj") : return "-1";
}

// posting data to API function
post_to_api = function(){

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

monxPop = function(){
	var target = "127.0.0.1";
	var target_port = 110;
	var net = require('net');
	var client = net.connect({hostname: target,port: target_port},function(){ //'connect' listener
			console.log('OK ');	//client.write('world!\r\n');
		});
	client.on("error", function(err) { 
		console.log("UNABLE TO CONNECT");
		client.end();
	});
	
	client.on('data', function(data) {
		console.log(data.toString());
		client.end();
	});
	
	client.on('end', function() {
		// ktu duhet bo returni me ti 
		// dhe jarebi duhet implementu timeout i me nej event me siper 
		console.log('Disconnected from server');
	});
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


	http.request("http://arbl.zero1.al/", function(response) {
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




//monx_ping()
//monx_http_stat()
//monx_http_match()
//monx_pop()

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

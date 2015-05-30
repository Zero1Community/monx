var configs = require('../config/configs.js');
// libs and shit 
var amqp = require('amqplib');
//var API_POST_URL = "http://monx.zero1.al:31416/api/service_data";

// per tu shtu:
// throttle (kjo behet ne vend tjeter faktikisht)

// web analysis per te identifiku sensoret automatikisht
// tipit 
// dns, web, match, snmpt,pop, etj..

// SMS, Twitter, Email , Makjato , Kafe..

amqp.connect('amqp://localhost').then(function(conn) {
	process.once('SIGINT', function() { conn.close(); });
	return conn.createChannel().then(function(ch) {
		
		var ok = ch.assertQueue('all_checks', {durable: false});
		// todo : error catching per kur nuk lidhet queueja 
		ok = ok.then(function(_qok) {
			return ch.consume('all_checks', function(msg) {
				if(configs.debug) console.log(" [x] Received a task");
				// kemi objektin me vllai me gjonat mwena 
				var toCheck = JSON.parse(msg.content.toString());
				if(configs.debug) console.log(toCheck);
			processWork(toCheck);
				//console.log(msg);
			}, {noAck: true});
		});

		return ok.then(function(_consumeOk) {
			if(configs.debug) console.log(' [*] Waiting for messages. To exit press CTRL+C');
		});
	});
}).then(null, console.warn);


// duhet nje seksion per analysis
// tipit blacklista, skano portat, shif ssl-ne

function processWork(tC,callback){
	if(tC.type === "blacklist_check"){
		monxBlacklist(tC);
	}
}

// posting data to API function
function postToAPI(data){
	var request = require('request');
	if(configs.debug) console.log('Data received', data);

	var options = {
	  uri: configs.api_url + 'service-data/add',
	  method: 'POST',
	  json: {
	    data : {
		    message: data.message,
		    status: data.status,
		    service_id: data.service_id
	    }
	  }
	};

	request(options, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
  		if(configs.debug) console.log('Posted to API');
	    if(configs.debug) console.log(body)
	  }
	});
}

// blacklist module
function monxBlacklist(blacklistObject){
	var checkRBL = require('../modules/checkBlacklist.js');

	checkRBL(blacklistObject.host, function(results){
		if(configs.debug) console.log('Scan finished for: ' + blacklistObject.host);
		//if(configs.debug) console.log('Result: ', results);

		//The logic for the status to be handled
		var data = {
			message: results,
			status: 1,
			service_id: blacklistObject._id
		}
		postToAPI(data);
		//API post here?
	});
}
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
	if(tC.type === "blacklist_check"){
		monxBlacklist(tC);
	}
}

// posting data to API function
function postToAPI(sms){
	var request = require('request');
	console.log(sms);
	console.log("U postu ne api me aspi")

	request.post(
	    'http://www.yoursite.com/formpage',
	    { form: { key: 'value' } },
	    function (error, response, body) {
	        if (!error && response.statusCode == 200) {
	            console.log(body)
	        }
	    }
	);
}

// blacklist module
function monxBlacklist(blacklistObject){
	var checkRBL = require('../modules/checkBlacklist.js');

	checkRBL(blacklistObject.host, function(results){
		console.log('Scan finished for: ' + blacklistObject.host);
		//console.log(results);
		postToAPI(results)
		//API post here?
	});
}
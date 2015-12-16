var configs = require('../config/configs.js');
var amqp    = require('amqplib');
var logger  = require('../modules/logger.js')('workProcessor', configs.logs.processor);
// TODO: error handling post to api


// per tu shtu: ------
// throttle (kjo behet ne vend tjeter faktikisht)

// web analysis per te identifiku sensoret automatikisht
// tipit 
// dns, web, match, snmpt,pop, etj..

amqp.connect(configs.rabbitmq.url).then(function(conn) {
	process.once('SIGINT', function() { conn.close(); });
	return conn.createChannel().then(function(ch) {
		
		var ok = ch.assertQueue('all_checks', {durable: false});
		// todo : error catching per kur nuk lidhet queueja 
		ok = ok.then(function(_qok) {
			return ch.consume('all_checks', function(msg) {
				logger('info',' [x] Received a task');
				var toCheck = JSON.parse(msg.content.toString());
				//if(configs.debug) console.log(toCheck);
				processWork(toCheck);
				//if(configs.debug) console.log(msg);
			}, {noAck: true});
		});

		return ok.then(function(_consumeOk) {
			logger('info',' [*] Waiting for messages. To exit press CTRL+C');
		});
	});
}).then(null, logger('info',console.warn)).catch(function (err) {
	logger('error', err);
	process.exit(1);
});


// atm here we have only blacklist_check but this eventually will be extended 
// with port scan, ssl check, smtp, ping and other stuff like that

function processWork(tC,callback){
	logger('info','Got type: ' + tC.type);
	if(tC.type === "blacklist"){
		monxBlacklist(tC);
	}
	if(tC.type === "http_status"){
		monxHttpStatus(tC);
	}
}




// posting data to API function
function postToAPI (data) {
	var request = require('request');
	logger('info','Posting to API');
	//if(configs.debug) console.log('Data received', data);
	var options = {
	  uri: configs.api_url + 'service-data/add',
	  //headers: { 'Content-Type': 'application/json', },
	  method: 'POST',
	  json: {
	    data : {
		    message: data.message,
		    status: data.status,
		    service_id: data.service_id,
		    user: data.user
	    }
	  }
	};
	request(options, function(error, response, body){
	  if(error) {
	      logger('error','Got error while posting data to API !');
	      logger('error',error);
	  } else {
	      logger('info','Data posted to API!');
	      logger('info',response.statusCode);
		}
	});
}

// http status module
function monxHttpStatus(httpStatObject){
	// duhet taru timeouti
	var checkHttpStatus = require('../modules/checkHttpStatus.js');
	checkHttpStatus(httpStatObject.url,8000.,function(data){
		// duhet fut timeout
		//postToAPI(data);
	});
}

// blacklist module
function monxBlacklist(blacklistObject){
	var checkRBL = require('../modules/checkBlacklist.js');

	checkRBL(blacklistObject.host, 80000, function(totalResults){
		logger('info','Scan finished for: ' + blacklistObject.host);
		//if(configs.debug) console.log('Result: ', results);
		var blackStatus = [];
		var timeoutStatus = [];
		var cleanStatus = [];
		var stat = 'OK';
		//The logic for the status to be handled
		for (var i = totalResults.length - 1; i >= 0; i--) {
			if(totalResults[i]['status'] > 0){
				if(totalResults[i]['status'] == 1){
					stat = 'ERROR';
					blackStatus.push(totalResults[i]);
				}
				if(totalResults[i]['status'] == 2){
					timeoutStatus.push(totalResults[i]);
				}
			}
			else{
				cleanStatus.push(totalResults[i]);
			}
			logger('info',totalResults[i]);
		};

// TODO: FIX THIS
//   Error
// { [Error: connect ECONNREFUSED]
//   code: 'ECONNREFUSED',
//   errno: 'ECONNREFUSED',
//   syscall: 'connect' }
// undefined
// Error
// { [Error: connect ECONNREFUSED]
//   code: 'ECONNREFUSED',
//   errno: 'ECONNREFUSED',
//   syscall: 'connect' }
// undefined

		var data = {
			message: {
				listed : blackStatus,
				timeout: timeoutStatus,
				clean: cleanStatus
			},
			status: stat,
			service_id: blacklistObject._id,
			user: blacklistObject.user
		}

		postToAPI(data, function(err) {
			if(err){
				logger('error',err);
			} else {
				logger('info','Data posted!');
			}
		}, 3000);
	});
}
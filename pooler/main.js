var configs = require('../config/configs.js');
// libs and shit 
var amqp = require('amqplib');

// kjo eventualisht do ndrrohet ne dicka me te hajrit
var db = require('mongojs').connect('noprod', ['notifications']);
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

function getLastNotific(service_id,callback){
	var mycollection = db.collection('notifications');
	console.log("U mor id si parameter : " + service_id);
	//db.notifications.find({id_:service_id}).sort().limit( 1 ).toArray(function(err, recs) {
	mycollection.find({service_id : service_id}).sort({created_at:-1}).limit(1).toArray(function(err, elem) {	
		//console.log("U bo query");
		//console.log("Mbarou bo query");
		if(elem.length > 0){
			//console.log('Statusi i fundit per id '+ service_id + " eshte "+ elem[0].status);
			callback(null,elem[0].status);
			//console.log(elem[0].status);
		}
		else{
			console.log('Nuk kemi notifications per ate ID');
			callback(null,-1);
		}

	});
}


function getLastStatus(service_id,callback){
	var mycollection = db.collection('service_data_' + service_id);
	console.log("U mor id si parameter : " + service_id);
	//db.notifications.find({id_:service_id}).sort().limit( 1 ).toArray(function(err, recs) {
	mycollection.find({}).sort({created_at:-1}).limit(1).toArray(function(err, elem) {	
		console.log("U bo query");
		console.log("Mbarou bo query");
		if(elem.length > 0){
			//console.log('Statusi i fundit per id '+ service_id + " eshte "+ elem[0].status);
			callback(null,elem[0].status);
			//console.log(elem[0].status);
		}
		else{
			console.log('nuk kemi te dhena per ate ID');
			callback("nuk kemi te dhena per ate ID",-1);
		}
	});
}

// blacklist module
function monxBlacklist(blacklistObject){
	var checkRBL = require('../modules/checkBlacklist.js');

	checkRBL(blacklistObject.host, function(totalResults){
		if(configs.debug) console.log('Scan finished for: ' + blacklistObject.host);
		//if(configs.debug) console.log('Result: ', results);
		var cleanStatus = {};
		//The logic for the status to be handled
		for (var i = totalResults.length - 1; i >= 0; i--) {
			if(totalResults[i]['status'] > 0){
				console.log(totalResults[i]);
				cleanStatus.push({totalResults[i]})
			}
		};
		////// duhet fut nej gjo ne redis ne mes 
		////// se u cam duke bo query ne db..
		////// minimalisht statuset e fundit te sherbimeve (paralelisht me updatin e tyre ne db)
		/// qe te kontrollojme ne redis statuset e fundit te db-ve 

		// CURR_STATUS = statusi qe na vjen nga monitorimi
		// LAST_STATUS = statusi i fundit i sherbimit me ID ne collectionin e tij
		// A = NQS statusi i fundit eshte CLEAN
		// B = madhesia e objektit cleanStatus = 0
		// C = useri eshte notificuar per LAST_STATUS 
		//			(dmth statuset == ne service_data_collection dhe nontification)

		// PSEUDO:
		// NQS A DHE B dhe C 
		//		ska nevoje per gje
		// NQS A dhe !B:
		// 		NQS C:
		// 			NQS CURR_STATUS === LAST_STATUS
		//				ska nevoje per gje
		//			PERNDRYSHE 
		//				//status problem por qe problem i ri { nga 3 bl u ben 4})
		//				co email me problemin e ri
		//				updato collectionin e NOTIFIC me  CURR_STATUS
		//		PERNDRYSHE
		//			co email		
		//			updatojme db-ne PROBLEM
		//if(cleanStatus.length > 0){
		//	
		//}

		var data = {
			message: {
				cleanStatus,
				totalResults
			},
			status: 1,
			service_id: blacklistObject._id
		}
		postToAPI(data);
		//API post here?
	});
}
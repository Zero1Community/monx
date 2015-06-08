var configs = require('../config/configs.js');

// po msoj doren , kjo eventualisht do ndrrohet ne dicka me te hajrit
var db = require('mongojs').connect('mongodb://zero1:itrhzzillxqkhmbz@ds031882.mongolab.com:31882/noprod', ['service_data_556053920c3ae62c1488d102']);
//var db = require('mongojs').connect('noprod', ['notifications']);


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

		// NQS madhesia e objektit cleanStatus > 0 :
		// 		NQS i kemi cuar email robit per ket problemin
		// 			NQS STATUSI eshte i njejte 
		//				hic
		//			PERNDRYSHE 
		//				//status problem por qe problem i ri { nga 3 bl u ben 4})
		//				co email me problemin e ri		
		//				updatojme db-ne PROBLEM
		//		PERNDRYSHE
		//			co email		
		//			updatojme db-ne PROBLEM





getLastNotific('556053920c3ae62c1488d102',function(err,status){
	if(err){
		console.log(err);
	}
	else{
		console.log(status);
	}
});
//getLastStatus('11111')
// var rblcheck = require('../modules/checkBlacklist.js');

// rblcheck('mail.alsat.tv', function(res){
// 	console.log(res);
// });
var dbConfig = require('../config/db.js');
var configs = require('../config/configs.js');
var MongoClient = require('mongodb').MongoClient;


function get(service_id, callback) { 

	MongoClient.connect(dbConfig.url, function(err, db) {
		if (err) {
			if(configs.debug) console.log('Unable to connect to the mongoDB server.', err);
			return callback(err);
		} else {
			var collection = db.collection('service_data_' + service_id);
			collection.find({}).toArray(function(err, result){
				if(err) { 
					if(configs.debug) console.log('Unable get records.', err);
					return callback(err);
				}
				if(configs.debug) console.log('Records for the service_id provided: ', result);
				db.close();
				return callback(null, result);
			});
		}
	});
}

get('556053920c3ae62c1488d102', function(err, result) {
	result.forEach(function(object){
		console.log(object)	;
	})
});
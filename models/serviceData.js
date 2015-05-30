var dbConfig = require('../config/db.js');
var configs = require('../config/configs.js');
var MongoClient = require('mongodb').MongoClient;

function newServiceData(data, callback) {
	MongoClient.connect(dbConfig.url, function(err, db){
		if (err) {
			if(configs.debug) console.log('Unable to connect to the mongoDB server.', err);
			return callback(err);
		} else {
			var collection = db.collection('service_data_' + data.service_id);
			collection.insert({ message: data.message, status:data.status, created_at: new Date()}, function(err, result){
				if(configs.debug && err) { 
					return callback(err);
					console.log('Unable to to save record.', err);
				}
				if(configs.debug) console.log('Result saved: ', result);
				db.close();
				return callback(null, result);
			});
		}
	});
}

module.exports = newServiceData;
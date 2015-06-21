var dbConfig    = require('../config/db.js');
var configs     = require('../config/configs.js');
var MongoClient = require('mongodb').MongoClient;
var logger      = require('../modules/logger.js');

var serviceData = {
	new: function (data, callback) {
				MongoClient.connect(dbConfig.url, function(err, db){
					if (err) {
						if(configs.debug) logger.debug('Unable to connect to the mongoDB server.', err);
						return callback(err);
					} else {
						var collection = db.collection('service_data_' + data.service_id);
						collection.insert({ message: data.message, status:data.status, created_at: new Date()}, function(err, result){
							if(err) { 
								if(configs.debug) logger.debug('Unable to to save record.', err);
								return callback(err);
							}
							if(configs.debug) logger.debug('Result saved: ', result);
							db.close();
							return callback(null, result);
						});
					}
				});
			},
	find: function(service_id, callback) { 
				MongoClient.connect(dbConfig.url, function(err, db) {
						if (err) {
							if(configs.debug) logger.debug('Unable to connect to the mongoDB server.', err);
							return callback(err);
						} else {
							var collection = db.collection('service_data_' + service_id);
							collection.find({}).toArray(function(err, result){
								if(err) { 
									if(configs.debug) logger.debug('Unable get records.', err);
									return callback(err);
								}
								if(configs.debug) logger.debug('Records for the service_id provided: ', result);
								db.close();
								return callback(null, result);
							});
						}
					});
			}	
}

module.exports = serviceData;
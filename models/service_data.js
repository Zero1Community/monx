function serviceData(service_id){
	var mongoose = require('mongoose');

	var collection = 'service_data_' + service_id;
	var serviceDataSchema = new mongoose.Schema({
			status: String,
			created_at: { type: Date, required: true, default: Date.now }
		},{ strict: false });

	return mongoose.model('ServiceData', serviceDataSchema, collection);	
}

module.exports = serviceData;
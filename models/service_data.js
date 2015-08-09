function serviceData(service_id){
	var mongoose = require('mongoose');
	var mongoosePaginate = require('mongoose-paginate');


	var collection = 'service_data_' + service_id;
	var serviceDataSchema = new mongoose.Schema({
			status: String,
			source: String,
			created_at: { type: Date, required: true, default: Date.now }
		},{ strict: false });

	serviceDataSchema.plugin(mongoosePaginate);
	
	var service_data_model = mongoose.models['ServiceData_' + service_id];
	if(service_data_model){
		return ServiceData = service_data_model;
	} else {
		return mongoose.model('ServiceData_' + service_id, serviceDataSchema, collection);	
	}

}

module.exports = serviceData;
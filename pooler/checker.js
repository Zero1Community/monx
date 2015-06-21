var mongoose = require('mongoose');
var Notify = require('../modules/notify.js');
var dbConfig = require('../config/db.js');

function checker(new_data){
	mongoose.connect(dbConfig.url);

	var serviceData = require('../models/service_data.js')(data.service_id);
	var Notification = require('../models/notification.js');
	
	serviceData.findOne({}, {}, { sort: { 'created_at' : -1 } }, function(err, last_data) {
		//a ka service data
		Notification.findOne({}, {}, { sort: { 'created_at' : -1 } }, function(err, notification_data){
  		mongoose.connection.close();	
  		if(err) console.log(err); return;

  		//KOMENT I MADH
  		//Notify();
			
			var last_status = last_data.status;
		  var new_status = new_data.status;
		  var notification_status = notification_data.status;

		  if(last_status === 'OK' && new_status === 'OK') {
		  	if(notification_status === 'OK') return;
		  	//dergo email shto notification
		  }

		  if(last_status === 'ERROR' && new_status === 'ERROR') {
		  	//llogjina e errorit NQS ( ERROR_N != ERRORI_L )
		  	if(notification_status === 'ERROR') return;
		  	//dergo email shto notification
		  }

		  if(last_status === 'OK' && new_status === 'ERROR') {
		  	if(notification_status === 'ERROR') return;

		  	//dergo email plus notification

		  	/*var u = new Notification();
		  	u.user = new_data.user;
		  	u.service = new_data.service_id;
		  	u.status = 'OK';
		  	u.message = 'o boss te ka ra faqja';
		  	u.save();*/
		  }

		  if(last_status === 'ERROR' && new_status === 'OK') {
		  	if(notification_status === 'OK') return;

		  	//dergo email plus notification qe u zgjidh
		  }



  		




  	});
	 // console.log( last_data );
	});
}

var data = {
	message: [],
	status: 'ERROR',
	service_id: '556053920c3ae62c1488d102',
	user: '5560537b0c3ae62c1488d101'
}

checker(data);

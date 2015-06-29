//var mongoose = require('mongoose');
var Mailman = require('./mailer.js');
//var dbConfig = require('../config/db.js');
var User = require('../models/user.js');
var Notification = require('../models/notification.js');
var configs = require('../config/configs.js');

function updateAndNotify(notific,status_subject){
	// TODO: add notific type to implement SMS, TWEET, push_notific and other type of notifications
	// in the notific object we have the user ID and the service ID 
	// this enables us to get the email from the userID  
	// console.log(notific);
	// console.log(status_subject);
	//mongoose.connect(dbConfig.url);		
	User.findOne({_id: notific.user}, function(err, user) {
	   	if(err)	{
	   		if(configs.debug) console.log(err);	
	   		return;
	   	}
	   	//console.log("User found!");
	    //console.log(user);
			var collected_message = status_subject + " for "+ notific.status +"\n " + notific.message + " \n ";
			var tick = {
				message : collected_message,
				subject : status_subject,
				name : user.name,
				email : user.email
			}

			Mailman.sendOne("newsletter",tick,function(err,res){
					if(err){
						if(configs.debug) console.log(err);
					}else{
						if(configs.debug) console.log(res);
					}
			});

			var u = new Notification();
			u.user = notific.user;
			u.service = notific.service_id;
			u.status = notific.status;
			u.message = collected_message;
			u.save(function(err) {
				if(err){
					if(configs.debug) console.log('Unable to save the event in the db : ');
					if(configs.debug) console.log(err);
				} else {
					if(configs.debug) console.log('Event successfully saved');
	    		//mongoose.connection.close();
				}
			});
		});
}


function checker(new_data){
	//mongoose.connect(dbConfig.url);
	console.log(new_data);
	var serviceData = require('../models/service_data.js')(new_data.service_id);
	serviceData.findOne({}, {}, { sort: { 'created_at' : -1 } }, function(err, last_data) {
		//need to implement additional check here for service data
		if(err){
			if(configs.debug) console.log(err);
			return err;
		}
		if(last_data === null){
			last_data = {
				status : 'OK'
			}
		}
		//console.log(last_data);	
		Notification.findOne({service:new_data.service_id}, {}, { sort: { 'created_at' : -1 } }, function(err, notification_data){
			//mongoose.connection.close();	
			console.log(notification_data);
			if(err) {
				if(configs.debug) console.log(err); 
				return;
			}
			//console.log(notification_data);

			var last_status = last_data.status;
			var new_status = new_data.status;
			if(notification_data === null){
				notification_data = {
					status : 'OK'
				}
			}
			var notification_status = notification_data.status;
			if(configs.debug) console.log("Current Status: \n")
			if(configs.debug) console.log('Last status '+ last_status);
			if(configs.debug) console.log('New status '+ new_status);
			if(configs.debug) console.log('Last Notification status '+ notification_status);

			if(last_status === 'OK' && new_status === 'OK') {
				if(notification_status === 'OK') return;
				//"RECOVERY" 
				updateAndNotify(new_data,"SERVICE RECOVERY", function(){
							//console.log("Mail sent");
					}); 
			}

			if(last_status === 'ERROR' && new_status === 'ERROR') {
				//we need to implement error checking here 
				// IF ( new error != old error ) { email about status update of error }
				// basically we need to check the message
				if(notification_status === 'ERROR') return;
				 updateAndNotify(new_data,"SERVICE NEW_ERROR", function(){
							//console.log("Mail sent");
					}); 
			}

			if(last_status === 'OK' && new_status === 'ERROR') {
				if(notification_status === 'ERROR') return;
					updateAndNotify(new_data,"SERVICE ERROR", function(){
							//console.log("Mail sent");
					});
			}

			if(last_status === 'ERROR' && new_status === 'OK') {
				if(notification_status === 'OK') return;
				updateAndNotify(new_data,"SERVICE RECOVERY", function(){
							//console.log("Mail sent");
					}); //STATUS RECOVERY
			}

		});
	 // console.log( last_data );
	});
}

module.exports = checker;
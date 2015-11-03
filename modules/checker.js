var Mailer = require('./mailer.js');
var User = require('../models/user.js');
var Notification = require('../models/notification.js');
var Service     = require('../models/service.js');
var configs = require('../config/configs.js');
var ServiceData = require('../models/service_data.js');
//var logger      = require('../modules/logger.js');
var logger = require('../modules/logger.js')('workEmmit', configs.logs.checker);
var _ = require('underscore');

function updateAndNotify(notific,status_subject){
	// TODO: add notific type to implement SMS, TWEET, push_notific and other type of notifications
	// in the notific object we have the user ID and the service ID 
	// this enables us to get the email from the userID  
	// console.log(notific);
	// console.log(status_subject);
	//mongoose.connect(dbConfig.url);

	// TODO : kjo sduhet bere ktu, duhet marre nga sherbimi perkates 
	// lista e emaileve te cileve duhen cuar emailet 
	// pasi notificationi eshte ne baze sherbimi
	User.findOne({_id: notific.user}, function(err, user) {
	   	if(err)	{
	   		logger('error',err);	
	   		//TODO: fix this return
	   		return;
	   	}

		var collected_message = status_subject + " for " + notific.service_name + " \n ";
			
		if(!notific.mute_status){

			var tick = {
				message : collected_message,
				subject : status_subject + ' for service ' + notific.service_name,
				name : user.name,
				email : user.email,
				event_id : notific.notification_id,
				service_id : notific.service_id,
				event_body : JSON.stringify(notific.message)
			}
			// TODO: fix this
			// www-0 debug:  Error: Connection timeout
			//     at SMTPConnection._formatError
			Mailer.sendOne("notifications/new",tick,function(err,res){
					if(err){
						logger('error',err);
					}else{
						logger('info',res);
					}
			});
		}
			var u = new Notification();
			u.user = notific.user;
			u.service = notific.service_id;
			u.status = notific.status;
			u.message = collected_message;
			u.save(function(err) {
				if(err){
					logger('error','Unable to save the event in the db : ');
					logger('error',err);
				} else {
					logger('info','Event successfully saved');
				}
				//return;
			});
		});
}


function checker(new_data){

	logger('info','Got into phase 2 in checker');
	logger('info',new_data);
	// TODO: handle kur ska sherbim ?
	Service.findById(new_data.service_id, function(err, service){
		logger('info','Finding the service ');
		if(err) {
			logger('error','Error finding the service with id' + data.service_id );
			logger('error',err);
			return err;
		}

		new_data['service_name'] = service.name;
		new_data['mute_status'] = service.notification_status.mute;

		service.status = new_data.status;
		service.last_checked = new Date();
		logger('error','Saving the service status and last checked');
		service.save(function(err) {
			 if(err) {
				logger('error','There was an error saving the service status', err);
				//TODO: hmm nej return ktu ?
			 } else {
			  	logger('info','The new service status was saved!');
				}
			});
	});

	var serviceData = ServiceData(new_data.service_id);
	serviceData.findOne({}, {}, { sort: { 'createdAt' : -1 } }, function(err, last_data) {
		//need to implement additional check here for service data
		
		var last_data_servers = []; 
		var new_data_servers = []; 
		
		if(err){
			logger('error',err);
			return err;
		}
		if(last_data === null){
			last_data = {
				status : 'OK'
			}
		}else{
			//TODO: fix this qe sdel heren e pare
			new_data['notification_id'] = last_data.id;
			last_data.message.listed.forEach(function (element) {
					logger('info','Listing last data');
					//console.dir(element.server);
					last_data_servers.push(element.server);
			});
		}

		new_data.message.listed.forEach(function (element) {
				logger('info','Listing new data');
				//console.dir(element.server);
				new_data_servers.push(element.server);
		});

		var removed = _.difference(last_data_servers,new_data_servers);
		var added = _.difference(new_data_servers,last_data_servers);

		if(removed.length > 0 || added.length > 0) {
			var diff = [];
			if(removed.length > 0){
				removed.forEach(function (server) {
						diff.push({server: server, action: 'removed'});
				});
			}

			if(added.length > 0){
				added.forEach(function (server) {
						diff.push({server: server, action: 'added'});
				});
			}

			new_data.message.diff = diff;
			if(diff.length > 0){
				//ruajme eventin 
				// TODO check before hand
				// TODO: if type blaclist
				var sData = new serviceData({
						message: new_data.message,
						status: new_data.status,
						source: new_data.source,
						// to be ndrruar source_IP me x-forwarded-for me vone
				});
				sData.save(function(err) {
		      if(!err) {
		      	logger('info','Event successfully saved');
		      }
		      else{
		      	logger('error','Error saving the event' + err);
		      }	
				});
			}
		}
	//});

		// TODO : check if this is OK
		Notification.findOne({service:new_data.service_id}, {}, { sort: { 'createdAt' : -1 } }, function(err, notification_data){
			//mongoose.connection.close();	
			console.log(notification_data);
			if(err) {
				logger('error',err); 
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
			logger('info',"Current Status: \n")
			logger('info','Last status '+ last_status);
			logger('info','New status '+ new_status);
			logger('info','Last Notification status '+ notification_status);

			if(last_status === 'OK' && new_status === 'OK') {
				if(notification_status === 'OK') return;
				//"RECOVERY" 
				updateAndNotify(new_data,"** Service Recovery", function(){
							logger('info',"Mail sent");
					}); 
			}

			if(last_status === 'ERROR' && new_status === 'ERROR') {
				// DIFF HERE
				//TODO kjo sma mbush mendjen..
				logger('info',new_data.message);
				if(notification_status === 'ERROR' && !new_data.message.diff) return;
				 updateAndNotify(new_data,"** Service Status Update", function(){
							logger('info',"Mail sent");
					}); 
			}

			if(last_status === 'OK' && new_status === 'ERROR') {
				//TODO: check statuset e fundit me modifiku titullin ne "Service flapping"
				if(notification_status === 'ERROR') return;
					updateAndNotify(new_data,"** Service Error", function(){
							logger('info',"Mail sent");
					});
			}

			if(last_status === 'ERROR' && new_status === 'OK') {
				if(notification_status === 'OK') return;
				updateAndNotify(new_data,"** Service Recovery", function(){
							logger('info',"Mail sent");
					}); //STATUS RECOVERY
			}

		});
	});
}

module.exports = checker;
var express = require('express');
var router = express.Router();
var Service     = require('../models/service.js');
var middleware = require('../middlewares/middlewares.js');
//var serviceData = require('../models/serviceData.js');
var configs = require('../config/configs.js');
var checker = require('../modules/checker.js');
var mongoose = require('mongoose');
var ServiceData = require('../models/service_data.js');
var _ = require('underscore');


router.post('/service-data/add', function(req, res){

	//to be validated
	// TODO: duhet bo extend ky dhe duhet kaluar me poshte 
	// mbasi eshte gjetur objekti ne menyre qe te fusim edhe EMRIN e sherbimit te subjekti
	var data = req.body.data;
	if(configs.debug) console.log(data);

	var serviceData = ServiceData(data.service_id);

	serviceData.findOne({}, {}, { sort: { 'createdAt' : -1 } }, function(err, last_data) {
		//need to implement additional check here for service data
		if(err){
			if(configs.debug) console.log(err);
			return err;
		}

		if(last_data){
			var last_data_servers = []; 
			var new_data_servers = []; 
			last_data.message.listed.forEach(function (element) {
					//console.log(element.server);
					last_data_servers.push(element.server);
			});
			data.message.listed.forEach(function (element) {
					//console.log(element.server);
					new_data_servers.push(element.server);
			});

			var added = _.difference(last_data_servers,new_data_servers);
			var removed = _.difference(new_data_servers,last_data_servers);

			if(removed.length == 0 && added.length == 0) {

		  				console.log('no diff');
							res.setHeader('Content-Type', 'application/json');
							res.end(JSON.stringify({'success': 1}));
				return;
			}

			var diff = [];
			if(removed.length > 0){
				removed.forEach(function (server) {
						//console.log(element.server);
						diff.push({server: server, action: 'removed'});
				});
			}

			if(added.length > 0){
				added.forEach(function (server) {
						//console.log(element.server);
						diff.push({server: server, action: 'added'});
				});
			}

			data.message.diff = diff;

		}

		// TODO check before hand
		var sData = new serviceData({
				message: data.message,
				status: data.status,
				// to be ndrruar me x-forwarded-for
				source: req.ip 
			});
			sData.save(function(err) {
		      if(!err) {
	  				console.log('Closing the connection');
						res.setHeader('Content-Type', 'application/json');
						res.end(JSON.stringify({'success': 1}));

					Service.findOne({_id:data.service_id}, function(err, service){
						
						data['service_name'] = service.name;
						data['mute_status'] = service.notification_status.mute;
						checker(data,function(err,res){
							if(err){
								console.log(err);
							}
							else{
								console.log(res);
							}
						});					
						service.status = data.status;
						console.log('Saving the service status');
						service.save(function(err) {
							 if(err) {
								logger.debug('There was an error saving the service', err);
							 } else {
							  	logger.debug('The new service was saved!');
							// // 	      // req.flash('success_messages', 'Service updated.');
						// 	      // res.redirect('/services/index');
								}
							});
					});
				} else {
					console.log('Closing the connection');
					res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify({'success': 0, error: 3}));
				}
			});
		});

});

module.exports = router;


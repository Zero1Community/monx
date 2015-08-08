var express = require('express');
var router = express.Router();
var Service     = require('../models/service.js');
var middleware = require('../middlewares/middlewares.js');
//var serviceData = require('../models/serviceData.js');
var configs = require('../config/configs.js');
var checker = require('../modules/checker.js');
var mongoose = require('mongoose');

router.post('/service-data/add', function(req, res){

	//to be validated
	// TODO: duhet bo extend ky dhe duhet kaluar me poshte 
	// mbasi eshte gjetur objekti ne menyre qe te fusim edhe EMRIN e sherbimit te subjekti
	var data = req.body.data;
	if(configs.debug) console.log(data);


	var ServiceData = require('../models/service_data.js')(data.service_id);
	
	var sData = new ServiceData({
			message: data.message,
			status: data.status,
			// to be ndrruar me x-forwarded-for
			source: req.ip 
		});
		sData.save(function(err) {
	      if(!err) {

				Service.findOne({_id:data.service_id}, function(err, service){

					data['service_name'] = service.name;
					checker(data,function(err,res){
						if(err){
							console.log(err);
						}
						else{
							console.log(res);
						}
					});
					
					service.status = data.status;


					service.save(function(err) {
						 if(err) {
							logger.debug('There was an error saving the service', err);
						 } else {
						  	logger.debug('The new service was saved!');
								res.setHeader('Content-Type', 'application/json');
								res.end(JSON.stringify({'success': 1}));
						      // req.flash('success_messages', 'Service updated.');
						      // res.redirect('/services/index');
							}
						});
				});
			} else {
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify({'success': 0, error: 3}));
			}
		});


	// var ServiceData = require('../models/service_data.js')(data.service_id);
	
	// var sData = new ServiceData({
	// 		message: data.message,
	// 		status: data.status,
	// 	});
	// 	sData.save(function(err) {
	//       if(!err) {

	// 			Service.findOne({_id:data.service_id}, function(err, service){

	// 				service.status = data.status;

	// 				service.save(function(err) {
	// 					 if(err) {
	// 						logger.debug('There was an error saving the service', err);
	// 					 } else {
	// 					  	logger.debug('The new service was saved!');
	// 							res.setHeader('Content-Type', 'application/json');
	// 							res.end(JSON.stringify({'success': 1}));
	// 					      // req.flash('success_messages', 'Service updated.');
	// 					      // res.redirect('/services/index');
	// 						}
	// 					});
	// 			});
	// 		} else {
	// 			res.setHeader('Content-Type', 'application/json');
	// 			res.end(JSON.stringify({'success': 0, error: 3}));
	// 		}
	// 	});



});

module.exports = router;


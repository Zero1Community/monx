var express     = require('express');
var router      = express.Router();
var dns         = require('dns');
var checkRBL    = require('../modules/checkBlacklist.js');
var Service     = require('../models/service.js');
var serviceData = require('../models/serviceData.js');
var Notification = require('../models/notification.js');
var configs = require('../config/configs.js');
var m  = require('../middlewares/middlewares.js');
var util        = require('util');
var logger      = require('../modules/logger.js');

router.get('/index', function(req, res){

  var user = req.user;
  // TODO: LIMIT / PAGINATION ?
// TODO:  getaddrinfo ENOTFOUND ds031882.mongolab.com ?? (nuk lidhemi dot me db dmth)
  Service.find({ user: user._id }, function(err, services) {
    
    if(!err) {
      res.render('services/index', { services: services });
    }

  });

});

router.get('/add', function(req, res){
	res.render('services/add');
});

router.get('/notifications', function(req, res) {
	var service_id = req.params.id;
	Notification.find({user: req.user} ,function(err, notifics) {
			if(!err && notifics) {
				// res.setHeader('Content-Type', 'application/json');
			 //  res.end(JSON.stringify(notifics));
				// console.log(notifics);
				res.render('services/notifics', {notifications : notifics});
			} else {
				logger.debug(err);
				res.flash('error_messages', 'No notifications for this service');
		    return res.redirect('/services/index');
			}
		});
});



router.get('/:id/data', function(req, res) {
	var service_id = req.params.id;
	serviceData.find(service_id ,function(err, data) {
			if(!err && data) {
				// res.setHeader('Content-Type', 'application/json');
				// res.end(JSON.stringify(data));
				res.render('services/data', {data : data});
			} else {
				logger.debug(err);
				res.flash('error_messages', 'No data for this service');
		    return res.redirect('/services/index');
			}
		});
});


router.get('/:id/edit', m.hasServiceAccess, function(req, res){
	//verifikim per fiksim ID
	Service.findOne({_id: req.params.id}, function (err, service) {
			if(err){
				res.end('No service found');
			}
		res.render('services/edit', {service : service});
	});	
});


router.post('/:id/edit', m.hasServiceAccess, function(req, res){
  
  //TODO fix messages
  // kontroll shtese nqs kjo ID eshte e KTIJ useri
  req.check('id', 'Service ID is required').notEmpty();
  req.check('name', 'Service name is required').notEmpty();
  req.check('host', 'Your name is required').notEmpty();
  req.check('type', 'A valid type is required').notEmpty();
  req.check('interval', 'The interval is required').notEmpty();
  req.check('status', 'The status is required').notEmpty();

	var errors = req.validationErrors();

	  if(errors){   //No errors were found.  Passed Validation!
	    req.flash('error_messages', errors);
	    return res.redirect('/services/add');
	  }   

		Service.findOne({_id:req.params.id}, function(err, service){

  	service.name = req.body.name;
  	service.host = req.body.host;
  	service.type = req.body.type;
  	service.interval = req.body.interval;
  	service.status = req.body.status;

		  service.save(function(err) {
		     if(err) {
		     	logger.debug('There was an error saving the service', err);
		     } else {
		     	logger.debug('The new service was saved!');
		      req.flash('success_messages', 'Service updated.');
		      res.redirect('/services/index');
		     }
		  });
		});
});

router.get('/:id', function(req, res) {
// ktu duhet marre thjesht configurimi total i atij sherbimi 

	var service_id = req.params.id;
	serviceData.find(service_id ,function(err, data) {
			if(!err && data) {
				// res.setHeader('Content-Type', 'application/json');
				// res.end(JSON.stringify(data));
				res.render('services/data', {data : data});
			} else {
				logger.debug(err);
				res.flash('error_messages', 'No data for this service');
		    return res.redirect('/services/index');
			}
		});
});



router.post('/add', function(req, res){
  
  //TODO fix messages
  req.check('name', 'Service name is required').notEmpty();
  req.check('host', 'Your name is required').notEmpty();
  req.check('type', 'A valid email is required').notEmpty();
  req.check('interval', 'The password is required').notEmpty();
  req.check('status', 'The password confirmation is required').notEmpty();

  var errors = req.validationErrors();

  if(errors){   //No errors were found.  Passed Validation!
    req.flash('error_messages', errors);
    return res.redirect('/services/add');
  }   

	var newService = new Service();

    newService.name = req.body.name;
    newService.host = req.body.host;
    newService.type = req.body.type;
    newService.interval = req.body.interval;

    newService.user = req.user;
   
    newService.save(function(err) {
       if(err) {
       	logger.debug('There was an error saving the service', err);
       } else {
       	logger.debug('The new service was saved!');
        req.flash('success_messages', 'Service added.');
        res.redirect('/services/index');
       }
    });
    
});

router.post('/mx', function(req, res){
	"use strict";
	var domain = req.body.domain;
	dns.resolveMx(domain, function(error, addr) {

		if(error) {
			logger.debug(error);
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify({'success': 0, 'message': 'No mx records'}));
		} else {
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(addr));
		}
	});
});

router.post('/blacklist', function(req, res){

	var domain = req.body.domain;
	logger.debug('routi');
	checkRBL(domain, function(server_result){
		logger.debug(server_result);
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(server_result));
	});

});


module.exports = router;
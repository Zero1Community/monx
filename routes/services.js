var express     = require('express');
var router      = express.Router();
var dns         = require('dns');
var checkRBL    = require('../modules/checkBlacklist.js');
var Service     = require('../models/service.js');
var serviceData = require('../models/serviceData.js');
var configs = require('../config/configs.js');
var middleware  = require('../middlewares/middlewares.js');
var util        = require('util');
var logger      = require('../modules/logger.js');

router.get('/index', function(req, res){

  var user = req.user;

  Service.find({ user: user._id }, function(err, services) {
    
    if(!err) {
      res.render('services/index', { services: services });
    }

  });

});

router.get('/add', function(req, res){
	res.render('services/add');
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

router.get('/:id', function(req, res) {
	var service_id = req.params.id;
	serviceData.find(service_id, function(err, data) {
		if(!err) {
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(data));
		} else {
			logger.debug(err);
			res.end('No data for this service');
		}

	});
});



module.exports = router;

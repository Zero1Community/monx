var express     = require('express');
var router      = express.Router();
var dns         = require('dns');
var checkRBL    = require('../modules/checkBlacklist.js');
var Service     = require('../models/service.js');
var serviceData = require('../models/serviceData.js');
var middleware  = require('../middlewares/middlewares.js');
var util        = require('util');
var logger      = require('../modules/logger.js');

router.post('/add', function(req, res){

  	/*req.checkParams('domain', 'Invalid domain param').isAlpha();

  	var errors = req.validationErrors();
	  if (errors) {
	    res.send('There have been validation errors:' + util.inspect(errors), 400);
	    return;
	  }*/

	var newService = new Service();

    newService.host = req.body.host;
    newService.type = req.body.type;
    newService.interval = req.body.interval;

    newService.user = req.user;
   
    newService.save(function(err) {
       if(err) {
       	logger.debug('There was an error saving the service', err);
       } else {
       	logger.debug('The new service was saved!');
       }
    });
    
	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify({'success': 0, 'message': 'No mx records'}));
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

router.get('/logs', function(req, res){
	var fs = require('fs');
	fs.readFile('./logs/monx.log', 'utf8', function (err, data) {
	  if (err) console.log(err);
	  if (err) throw err;
	  res.setHeader('Content-Type', 'application/json');
		res.end(data);
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

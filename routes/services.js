var express = require('express');
var router = express.Router();
var dns = require('dns');
var checkRBL = require('../modules/checkBlacklist.js');
var Service = require('../models/service.js');
var middleware = require('../middlewares/middlewares.js');
var util = require('util');

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
       	console.log('There was an error saving the service', err);
       } else {
       	console.log('The new service was saved!');
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
			console.log(error);
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

	checkRBL(domain, function(server_result){
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(server_result));
	});

});

module.exports = router;

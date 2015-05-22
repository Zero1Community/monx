var express = require('express');
var router = express.Router();
var dns = require('dns');
var checkRBL = require('../modules/checkBlacklist.js');

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
	
	dns.resolve4(domain, function(error, addr) {

		if(error) {
			console.log(error);
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify({'success': 0, 'message': 'Domain not found'}));
		} else {
			checkRBL(addr[0], function(server_result){
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(server_result));
			});
		}
	});
});

module.exports = router;

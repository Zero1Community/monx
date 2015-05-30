var express = require('express');
var router = express.Router();
var middleware = require('../middlewares/middlewares.js');
var serviceData = require('../models/serviceData.js');
var util = require('util');
var configs = require('../config/configs.js');

router.post('/service-data/add', function(req, res){
	if(configs.debug) console.log('u therrit');
	//to be validated
	var data = req.body.data;
	if(configs.debug) console.log(data);

	serviceData(data, function(err, result){
		if(!err) {
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify({'success': 1}));
		} else {
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify({'success': 0, error: 3}));
		}
	});r 
});

module.exports = router;


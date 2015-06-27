var express = require('express');
var router = express.Router();
var middleware = require('../middlewares/middlewares.js');
//var serviceData = require('../models/serviceData.js');
var configs = require('../config/configs.js');
var checker = require('../modules/checker.js');
var mongoose = require('mongoose');

router.post('/service-data/add', function(req, res){

	//to be validated
	var data = req.body.data;
	if(configs.debug) console.log(data);

	checker(data,function(err,res){
		if(err){
			console.log(err);
		}
		else{
			console.log(res);
		}
	});

	var ServiceData = require('../models/service_data.js')(data.service_id);
	
	var sData = new ServiceData({
			message: data.message,
			status: data.status,
		});

	sData.save(function(err) {
      if(!err) {
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify({'success': 1}));
		} else {
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify({'success': 0, error: 3}));
		}
    });

	


	/*serviceData.new(data, function(err, result){
		if(!err) {
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify({'success': 1}));
		} else {
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify({'success': 0, error: 3}));
		}
	});*/
});

module.exports = router;


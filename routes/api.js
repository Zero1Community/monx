var express = require('express');
var router = express.Router();
var middleware = require('../middlewares/middlewares.js');
//var serviceData = require('../models/serviceData.js');
var configs = require('../config/configs.js');
var checker = require('../modules/checker.js');
var mongoose = require('mongoose');
var ServiceData = require('../models/service_data.js');



router.post('/service-data/add', function(req, res){
	//TODO: duhen pare returnet e DNS-ve qe te jene vetem 127-ta , jo IP te cuditshme
	//TODO: paneli i adminit duhet te kete statusin e QUEVE dhe 1 buton qe fshin cachene e redisit
	//to be validated
	// TODO: duhet bo extend ky dhe duhet kaluar me poshte 
	// mbasi eshte gjetur objekti ne menyre qe te fusim edhe EMRIN e sherbimit te subjekti
	var data = req.body.data;
	if(configs.debug) console.log(data);

	// TODO check before hand
	//data['source'] = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	console.log('Calling checker');
	checker(data,function(err,res){
		if(err){
			console.log('Got error in phase 1 on checker ');
			console.log(err);
		}
		else{
			console.log(res);
			console.log('Success! Closing the connection');
		}
	});
	// 
	console.log('Closing the connection');
	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify({'success': 1, error: 0}));
});

module.exports = router;


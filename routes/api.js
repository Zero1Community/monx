var express     = require('express');
var router      = express.Router();
var middleware  = require('../middlewares/middlewares.js');
var configs     = require('../config/configs.js');
var logger      = require('../modules/logger.js')('api', configs.logs.api);
var checker     = require('../modules/checker.js');
var mongoose    = require('mongoose');
var ServiceData = require('../models/service_data.js');



router.post('/service-data/add', function(req, res){
	//TODO: duhen pare returnet e DNS-ve qe te jene vetem 127-ta , jo IP te cuditshme
	//TODO: paneli i adminit duhet te kete statusin e QUEVE dhe 1 buton qe fshin cachene e redisit
	//to be validated
	// TODO: duhet bo extend ky dhe duhet kaluar me poshte 
	// mbasi eshte gjetur objekti ne menyre qe te fusim edhe EMRIN e sherbimit te subjekti
	var data = req.body.data;
	logger('info',data);

	// TODO check before hand
	//data['source'] = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	logger('info','Calling checker');
	checker(data,function(err,res){
		if(err){
			logger('error','Got error in phase 1 on checker ');
			logger('error',err);
		}
		else{
			logger('info',res);
			logger('info','Success! Closing the connection');
		}
	});
	// 
	logger('info','Closing the connection');
	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify({'success': 1, error: 0}));
});

module.exports = router;


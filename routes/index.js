var express = require('express');
var Service     = require('../models/service.js');
var Notification = require('../models/notification.js');
var router = express.Router();
var m  = require('../middlewares/middlewares.js');

/* GET home page. */
router.get('/dashboard', m.isAuthenticated, function(req, res, next) {
	Notification.find({user: req.user} ,function(err, notifics) {
			if(!err && notifics) {
				// res.setHeader('Content-Type', 'application/json');
			 //  res.end(JSON.stringify(notifics));
				// console.log(notifics);
					Service.find({ user: req.user }, function(err, services) {
				    
				    console.log(services);
				    if(!err) {
				    var data_input = 0;
				    var services_number = 0;
				    var notifications_sent = notifics.length;

					for (var i = 0, len = services.length; i < len; i++) {
					  services_number += 1;
					  data_input += 60/services[i].interval;
					}
				  		res.render('dashboard', {services_number : services_number,data_input : data_input,notifications_sent : notifics.length});
				    }
				  	//res.render('dashboard');
				});
			} else {
				logger.debug(err);
			//	res.flash('error_messages', 'No notifications for this service');
		    //return res.redirect('/services/index');
			}
		});


});

router.get('/', function(req, res, next){
	res.render('home');
});

module.exports = router;

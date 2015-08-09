var express      = require('express');
var Service      = require('../models/service.js');
var Notification = require('../models/notification.js');
var router       = express.Router();
var m            = require('../middlewares/middlewares.js');
var logger       = require('../modules/logger.js');

router.get('/dashboard', m.isAuthenticated, function(req, res, next) {
	Notification.find({user: req.user} ,function(err, notifics) {
			if(!err && notifics) {

					Service.find({ user: req.user }, function(err, services) {
				    
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
				});
			} else {
				logger.debug(err);
				res.end('No data at all!');
			}
		});


});

router.get('/', function(req, res, next){
	res.redirect('/dashboard');
});

module.exports = router;

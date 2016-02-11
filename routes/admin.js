var express      = require('express');
var router       = express.Router();
var dns          = require('dns');
var checkRBL     = require('../modules/checkBlacklist.js');
var Service      = require('../models/service.js');
var ServiceData  = require('../models/service_data.js');
var Notification = require('../models/notification.js');
var configs      = require('../config/configs.js');
var m            = require('../middlewares/middlewares.js');
var util         = require('util');
var logger       = require('../modules/logger.js');
var mongoose     = require('mongoose');
var workEmmiter  = require('../modules/emmiter.js');
var logger       = require('../modules/logger.js')('services', configs.logs.services);


  //TODO: mini admin pannel 
router.get('/', function(req, res){
  var user = req.user;
  // TODO:  getaddrinfo ENOTFOUND ds031882.mongolab.com ?? (nuk lidhemi dot me db dmth)
  Service.find({ user: user._id }).sort('-createdAt').exec( function(err, services) {

  //Service.paginate({}, { page: req.query.page, limit: req.query.limit, sortBy: {createdAt : -1} }, function(err, services, pageCount, itemCount) {
    if(!err) {
      res.render('services/index', { 
        services: services,
        page_title: 'Services'
      });
    }
    else{
      logger('error','Error getting the services/index route');
      logger('error',err);
    }
  });
});

router.get('/users', function(req, res){
	//res.render('services/add', {page_title: 'Add new service'});
});

router.get('/users/:id/', function(req, res){

 //  req.check('id', 'ID Required').notEmpty();
 //  req.check('event_id', 'Event ID Required').notEmpty();

 //  var errors = req.validationErrors();

 //  if(errors){
 //    logger('error',error);
 //    req.flash('error_messages', errors);
 //    return res.redirect('/services/' + req.params.id + '');
 //  }

	// var serviceData = ServiceData(req.params.id);
	// serviceData.findById(req.params.event_id, function(err, data) {
	// 		if(!err) {
 //        logger('error',err);
	// 			res.render('services/event', {event_data: data, page_title: 'Event Details'});
	// 		} else {
	// 			logger('error',err);
	// 			  res.flash('error_messages', 'No data for this service');
	// 	      res.redirect('/services');
	// 		}

	// 	});
});

router.get('/notifications', function(req, res) {

  Notification.find({user: req.user}).sort('-createdAt').populate('service').exec(function(err, notifics) {
			if(!err && notifics) {
				res.render('services/notifics', {notifications: notifics, page_title: 'Notifications'});
			} else {
				logger('error',err);
				res.flash('error_messages', 'No notifications for this service');
		    return res.redirect('/services/index');
			}
		});

});


router.get('/:id/edit', m.hasServiceAccess, function(req, res){

});



router.post('/user/:id/delete', m.hasServiceAccess, function(req, res){
});

router.get('/:id/action/:action', m.hasServiceAccess, function(req, res){
	

});

router.get('/:id/data', function service_data(req, res) {

});


router.post('/add', function(req, res){
    
});

module.exports = router;
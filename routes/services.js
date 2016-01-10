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

router.get('/add', function(req, res){
	res.render('services/add', {page_title: 'Add new service'});
});

router.get('/:id/events/:event_id', function(req, res){

  req.check('id', 'ID Required').notEmpty();
  req.check('event_id', 'Event ID Required').notEmpty();

  var errors = req.validationErrors();

  if(errors){
    logger('error',error);
    req.flash('error_messages', errors);
    return res.redirect('/services/' + req.params.id + '');
  }

	var serviceData = ServiceData(req.params.id);
	serviceData.findById(req.params.event_id, function(err, data) {
			if(!err) {
        logger('error',err);
				res.render('services/event', {event_data: data, page_title: 'Event Details'});
			} else {
				logger('error',err);
				  res.flash('error_messages', 'No data for this service');
		      res.redirect('/services');
			}

		});
});

router.get('/notifications', function(req, res) {

	  // Notification.paginate({}, { page: req.query.page, limit: req.query.limit , sortBy: {createdAt : -1} }, function(err, notifics, pageCount, itemCount) {
      
   //    if(!err && notifics) {
   //      res.render('services/notifics', {
   //        notifications: notifics, 
   //        pageCount: pageCount,
   //        itemCount: itemCount,
   //        currentPage: req.query.page,
   //        page_title: 'Notifications'
   //      });
   //    } else {
   //      logger.debug(err);
   //      res.flash('error_messages', 'No notifications for this service');
   //      return res.redirect('/services/index');
   //    }

   //  });


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
	 
  req.check('id', 'ID Required').notEmpty();

  var errors = req.validationErrors();

  if(errors){
    logger('error',errors);
    req.flash('error_messages', errors);
    return res.redirect('/services/' + req.params.id + '');
  } 

	Service.findById(req.params.id, function (err, service) {
			if(err){
        logger('error',err);
        //TODO throw 404
				res.end('No service found');
			}
		res.render('services/edit', {service: service, page_title: 'Edit Service'});
	});	
});



router.post('/:id/edit', m.hasServiceAccess, function(req, res){
  //TODO: validation
  req.check('id', 'Service ID is required').notEmpty();
  req.check('name', 'Service name is required').notEmpty();
  req.check('host', 'Your name is required').notEmpty();
  req.check('type', 'A valid type is required').notEmpty();
  req.check('interval', 'The interval is required').notEmpty();
  // req.check('running_status', 'The running status is required').notEmpty();
  // req.check('mute_status', 'The mute_status is required').notEmpty();
  // req.check('twitter_status', 'The twitter status is required').notEmpty();
  // req.check('sms_status', 'The sms status is required').notEmpty();

	var errors = req.validationErrors();

  if(errors){
    logger('error',errors);
    req.flash('error_messages', errors);
    return res.redirect('/services/' + req.params.id + '/edit');
  }

	Service.findById(req.params.id, function(err, service){
    if(err){

    }
    logger('info',req.body);
  	service.name = req.body.name;
  	service.host = req.body.host;
  	service.type = req.body.type;
  	service.interval = req.body.interval;
    if (req.body.running_status ) {
      service.running_status = true;
    }
    else{
      service.running_status = false;
    }
  	service.notification_status.mute = req.body.mute_status ? true : false;
    service.notification_status.twitter = req.body.twitter_status ? true : false;
    service.notification_status.sms = req.body.sms_status ? true : false;
   //  console.log('Setting notification statuses');
   //  console.log(service.notification_status.mute);
   //  console.log(service.notification_status.twitter);
  	// console.log(service.notification_status.sms);
    workEmmiter(service,'service_updates');
		  service.save(function(err) {
		     if(err) {
		     	logger('error','There was an error saving the service');
          logger('error',err);
		      req.flash('error_messages', 'There was an error saving the service');
		      res.redirect('/services');
		     } else {
		     	logger('info','Service updated!');
		      req.flash('success_messages', 'Service updated.');
		      res.redirect('/services');
		     }
		  });
	});
});

router.get('/:id/delete', m.hasServiceAccess, function(req, res){

  req.check('id', 'ID Required').notEmpty();

  var errors = req.validationErrors();

  if(errors){
    logger('error',errors);
    req.flash('error_messages', errors);
    return res.redirect('/services/' + req.params.id + '');
  } 

  Service.findById(req.params.id).remove(function(err){
    if(err){
      logger('error',err);
    }
  	var service = {
  	  	_id: req.params.id,
  	  	running_status : false,
  	  	interval : 60,
  	  	name : "Temp",
  	  }

	  workEmmiter(service,'service_updates');
    var service_data_collection = 'service_data_' + req.params.id;

    mongoose.connection.db.dropCollection(service_data_collection, function(err, result) {

      if(!err) {
        req.flash('success_messages', 'Service deleted.');
        res.redirect('/services');
      }
      else{
        logger('error',err);
      }
      
    });

  });

});

router.get('/:id/action/:action', m.hasServiceAccess, function(req, res){
	
  req.check('id', 'ID Required').notEmpty();
  req.check('action', 'Action Required').notEmpty();

  var errors = req.validationErrors();

  if(errors){
    logger('error',errors);
    return res.json({success:0, error: errors});
  } 

	var action = req.params.action;

	Service.findById(req.params.id, function(err, service){

	  if(!err){

	  	switch(action) {
	  		case 'start_stop':
	  			var new_status = service.running_status ? false : true;
	  			service.running_status = new_status;
	  			workEmmiter(service,'service_updates');
	  			service.save(function(err) {
		            if(err) {
                  logger('error',err);
		            	res.json({success:0});
		            } else {
		            	res.json({success:1, new_status: new_status});
		            }
  			 	});
	  			break;
	  		case 'mute_unmute':
          var new_status = service.notification_status.mute ? false : true;
          service.notification_status.mute = new_status;
          service.save(function(err) {
            if(err) {
              logger('error',err);
              res.json({success:0});
            } else {
              res.json({success:1, new_status: new_status});
            }
          });		
	  			break;
        default:
          res.json({success:0});
        break;
	  	}
	  }
    else{
      logger('error',err);
    }
	});
});

router.get('/:id/data', function service_data(req, res) {

  req.check('id', 'ID Required').notEmpty();

  var errors = req.validationErrors();

  if(errors){
    logger('error',errors);
    return res.json({success:0, error: errors});
  } 

	var service_id = req.params.id;	
	var serviceData = ServiceData(service_id);

  serviceData.paginate({}, { page: req.query.page, limit: req.query.limit , sortBy: {createdAt : -1} }, function(err, data, pageCount, itemCount) {
			
      if(!err && data) {
				res.render('services/data', {
          data: data, 
          service_id : service_id,
          pageCount: pageCount,
          itemCount: itemCount,
          currentPage: req.query.page,
          page_title: 'Data for service'
        });
			} else {
				logger('error',err);
				res.flash('error_messages', 'No data for this service');
		    return res.redirect('/services/index');
			}
		});
});

router.get('/:id/history', function service_data(req, res) {

  req.check('id', 'ID Required').notEmpty();
  var errors = req.validationErrors();

  if(errors){
    logger('error',errors);
    return res.json({success:0, error: errors});
  } 

  var service_id = req.params.id; 
  var serviceData = ServiceData(service_id);

  serviceData.paginate({}, { page: req.query.page, limit: req.query.limit , sortBy: {createdAt : -1} }, function(err, data, pageCount, itemCount) {
      
      if(!err && data) {
        res.render('services/history', {
          data: data, 
          service_id : service_id,
          pageCount: pageCount,
          itemCount: itemCount,
          currentPage: req.query.page,
          page_title: 'Data for service'
        });
      } else {
        logger('error',err);
        res.flash('error_messages', 'No data for this service');
        return res.redirect('/services/index');
      }
    });
});




router.get('/:id', function(req, res) {

  req.check('id', 'ID Required').notEmpty();
  var errors = req.validationErrors();

  if(errors){
    logger('error',errors);
    req.flash('error_messages', errors);
    return res.redirect('/services');
  } 

	Service.findById(req.params.id, function(err, service){
		if(err) {
      logger('error','There was an error finding the service');
      logger('error',err);
    } else {
        var service_id = req.params.id; 
        var serviceData = ServiceData(service_id);
              serviceData.findOne({}, {}, { sort: { 'created_at' : -1 } }, function(err, service_data) {
                if (err) {
			               logger('error','There was an error finding the last event');
                     logger('error',err);
                }
                else if(service_data){
                  res.render('services/view', {service: service, service_data: service_data,page_title: 'Service details'});
                };
                res.render('services/view', {service: service, page_title: 'Service details'});
              });
		}	
	});
});



router.post('/add', function(req, res){
  
  req.check('name', 'Service name is required').notEmpty();
  req.check('host', 'Your name is required').notEmpty();
  req.check('type', 'A valid type is required').notEmpty();
  req.check('interval', 'An interval is required').notEmpty();
  // req.check('running_status', 'The status is required').notEmpty();
  // req.check('twitter_status', 'The twitter status is required').notEmpty();
  // req.check('sms_status', 'The sms status is required').notEmpty();

  var errors = req.validationErrors();

  if(errors){  
    req.flash('error_messages', errors);
    return res.redirect('/services/add');
  }   

	var newService = new Service();

  newService.name = req.body.name;
  newService.host = req.body.host;
  newService.type = req.body.type;
  newService.interval = req.body.interval;
  //newService.running_status = req.body.running_status;
  newService.running_status = req.body.running_status ? true : false;
  newService.notification_status.twitter = req.body.twitter_status ? true : false;
  newService.notification_status.sms = req.body.sms_status ? true : false;
  newService.notification_status.mute = req.body.mute_status ? true : false;

  newService.user = req.user;
  workEmmiter(newService,'service_updates');
  newService.save(function(err) {
     if(err) {
     	logger.debug('There was an error saving the service tek service', err);
     } else {
      req.flash('success_messages', 'Service added.');
      res.redirect('/services');
     }
  });
    
});

router.post('/mx', function(req, res){

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


module.exports = router;
var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var middlewares =  require('../middlewares/middlewares.js');
var crypto = require('crypto');
var Mailer = require('../modules/mailer.js');
var async = require('async');
var configs = require('../config/configs.js');

module.exports = function(passport){

	/* GET login page. */
	router.get('/login', function(req, res, next) {
		res.render('auth/login', { message: req.flash('message') });
	});

	/* Handle Login POST */
	router.post('/login', function(req, res, next){
			
		req.check('username', 'A valid email is required').isEmail();
        req.check('password', 'A password is required').notEmpty();
        
        var errors = req.validationErrors();

        if(errors){   //No errors were found.  Passed Validation!
			return res.render('auth/login', { message: errors });
        } 
		
		passport.authenticate('login', {
			successRedirect: '/dashboard',
			failureRedirect: '/users/login',
			failureFlash : true  
		})(req, res, next);
	
	});

	/* GET Registration Page */
	router.get('/signup', function(req, res){
		res.render('auth/signup', { message: req.flash('message') });
	});

	/* Handle Registration POST */
	router.post('/signup', function(req, res, next){

		req.check('name', 'Your name is required').notEmpty();
        req.check('email', 'A valid email is required').isEmail();
        req.check('password', 'The password is required').notEmpty();
        req.check('password_confirmation', 'The password confirmation is required').notEmpty();
        req.check('password_confirmation', 'The password confirmation is not the same as password').equals(req.body.password);
        req.check('terms', 'You must accept our terms of usage').notEmpty();
        
        var errors = req.validationErrors();

        if(errors){   //No errors were found.  Passed Validation!
			return res.render('auth/signup', { message: errors });
        } 

		passport.authenticate('signup', {
			successRedirect: '/dashboard',
			failureRedirect: '/users/signup',
			failureFlash : true  
		})(req, res, next);

	});

	/* Handle Forgot Password Form */
	router.get('/forgot-password', function(req, res){
		res.render('auth/forgotpassword');
	});

	router.post('/forgot-password', function(req, res, next){

        req.check('email', 'A valid email is required').isEmail();

        var errors = req.validationErrors();

        if(errors){   //No errors were found.  Passed Validation!
        	console.log(errors);
			return res.render('auth/forgotpassword', { message: errors });
        } 


		async.waterfall([
			function(done) {
			  crypto.randomBytes(20, function(err, buf) {
			    var token = buf.toString('hex');
			    done(err, token);
			  });
			},
			function(token, done) {

				User.findOne({email: req.body.email}, function (err, user) {
				    user.resetPasswordToken = token;
				    user.resetPasswordExpires = Date.now() + 3600000;

				    user.save(function (err) {
				        if(err) {
				            console.error('ERROR!');
				        }
						done(err, token, user);
				    });
				});

				/*User.update({email: req.body.email}, {
				   	resetPasswordToken: token,
			    	resetPasswordExpires: Date.now() + 3600000,
				}, function(err, numberAffected, rawResponse) {
					done(err, token, user);
				});*/
			},
			function(token, user, done) {
			  Mailer.sendOne("newsletter",user,function(err,res){
					if(err){
						if(configs.debug) console.log(err);
					}else{
						req.flash('message', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        				done(err, 'done');
					}
				});
			}
			], function(err) {
			if (err) return next(err);
			res.redirect('/users/forgot-password');
			});

	});

	/* Handle Logout */
	router.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	router.get('/view', middlewares.isAuthenticated, function(req, res){
		res.render('users/view', { user:req.user });
	});

	router.get('/edit', middlewares.isAuthenticated, function(req, res){
		res.render('users/edit', { user:req.user });
	});

	router.post('/update', middlewares.isAuthenticated, function(req, res){
		console.log(req.user.id);

		//TODO validation
		User.update({_id:req.user.id}, { name: req.body.name, email: req.body.email }, { multi: false }, function(err, numa){
			
			var user = req.user;
			user.name = req.body.name;
			user.email = req.body.email;

			//console.log(err);
			//console.log(numa);

			req.logIn(user, function(error) {
            if (!error) {
	               	res.render('users/view', { success: req.flash('success') });
	            }
	        });
		});

	});

	return router;
}
var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var middlewares =  require('../middlewares/middlewares.js');
var crypto = require('crypto');
var Mailer = require('../modules/mailer.js');
var async = require('async');
var configs = require('../config/configs.js');
var bCrypt = require('bcrypt-nodejs');


module.exports = function(passport){
	/* GET login page. */
	router.get('/login', function(req, res, next) {
		res.render('auth/login');
	});

	/* Handle Login POST */
	router.post('/login', function(req, res, next){
			
	req.check('username', 'A valid email is required').isEmail();
  req.check('password', 'A password is required').notEmpty();
    
    var errors = req.validationErrors();

    if(errors){   //No errors were found.  Passed Validation!
    	req.flash('error_messages', errors);
    	return res.redirect('/users/login');
	    } 
		
		passport.authenticate('login', {
			successRedirect: '/dashboard',
			failureRedirect: '/users/login',
			failureFlash : true  
		})(req, res, next);
	
	});

	/* GET Registration Page */
	router.get('/signup', function(req, res){
		res.render('auth/signup');
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
        	req.flash('error_messages', errors);
        	return res.redirect('/users/signup');
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
        	req.flash('error_messages', errors);
        	return res.redirect('/users/forgot-password');
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

					if(!user) {
						req.flash('error_messages', 'User not found.');
						return res.redirect('/users/forgot-password');
					}

				    user.resetPasswordToken = token;
				    user.resetPasswordExpires = Date.now() + 3600000;

				    user.save(function (err) {
				        if(err) {
				            console.error('ERROR!');
				        }
						done(err, token, user);
				    });
				});

			},
			function(token, user, done) {
			  Mailer.sendOne("newsletter",user,function(err,res){
					if(err){
						if(configs.debug) console.log(err);
					}else{
						req.flash('success_messages', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        				done(err, 'done');
					}
				});
			}
			], function(err) {
			if (err) return next(err);
			res.redirect('/users/forgot-password');
			});

	});

	router.get('/reset/:token', function(req, res) {

	  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
	    if (!user) {
	      req.flash('error_messages', 'Password reset token is invalid or has expired.');
	      return res.redirect('/users/forgot-password');
	    }
	    res.render('auth/reset', {
	      user: user,
	      token: req.params.token
	    });
	  });
	});

	router.post('/reset/:token', function(req, res) {

    req.check('password', 'The password is required').notEmpty();
		req.check('password_confirmation', 'The password confirmation is required').notEmpty();
    req.check('password_confirmation', 'The password confirmation is not the same as password').equals(req.body.password);
    
    var errors = req.validationErrors();

    if(errors) {
    	req.flash('error_messages', errors);
    	return res.redirect('/users/reset/' + req.params.token );    
    }    


	  async.waterfall([
	    function(done) {
	      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
	        if (!user) {
	          req.flash('error_messages', 'Password reset token is invalid or has expired.');
	          return res.redirect('back');
	        }

	        user.password = createHash(req.body.password);
	        user.resetPasswordToken = undefined;
	        user.resetPasswordExpires = undefined;

	        user.save(function(err) {
	          req.logIn(user, function(err) {
	            done(err, user);
	          });
	        });
	      });
	    },
	    function(user, done) {
	     	
	     	Mailer.sendOne("newsletter",user,function(err,res){
				if(err){
					if(configs.debug) console.log(err);
				}else{
	        		req.flash('success_messages', 'Success! Your password has been changed.');
    				done(err, 'done');
				}
			});
	    }
	  ], function(err) {
	    res.redirect('/users/login');
	  });
	});

	/* Handle Logout */
	router.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	router.get('/settings', middlewares.isAuthenticated, function(req, res){
		res.render('users/view', { user:req.user });
	});

	router.get('/settings/edit', middlewares.isAuthenticated, function(req, res){
		res.render('users/edit', { user:req.user });
	});

	router.post('/update', middlewares.isAuthenticated, function(req, res){
	
		req.check('name', 'Your name is required').notEmpty();
    req.check('email', 'A valid email is required').isEmail();

    if(req.body.password != '') {
    	//TODO min pass length
	    //req.check('password', 'The password is required').notEmpty();
	    req.check('password_confirmation', 'The password confirmation is required').notEmpty();
	    req.check('password_confirmation', 'The password confirmation is not the same as password').equals(req.body.password);
	    
    }

    var errors = req.validationErrors();

    if(errors){   //No errors were found.  Passed Validation!
    	req.flash('error_messages', errors);
    	return res.redirect('/users/settings/edit'); 
    } 

		var updated_user = { name: req.body.name, email: req.body.email };
     
   	if(req.body.password != '') {
			var temp_pass = createHash(req.body.password); 
			updated_user['password'] = temp_pass;
   	}

		//TODO validation
		User.update({_id:req.user.id}, updated_user, { multi: false }, function(err, numa){
			
			var user = req.user;
			user.name = req.body.name;
			user.email = req.body.email;

			//console.log(err);
			//console.log(numa);

			req.logIn(user, function(error) {
            if (!error) {	
            		req.flash('success_messages', 'User updated.');
            		res.redirect('/users/settings');
	            }
	        });
		});

	});

	var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

	return router;
}
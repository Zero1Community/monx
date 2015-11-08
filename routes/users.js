var express     = require('express');
var router      = express.Router();
var User        = require('../models/user.js');
var middlewares = require('../middlewares/middlewares.js');
var crypto      = require('crypto');
var Mailer      = require('../modules/mailer.js');
var async       = require('async');
var configs     = require('../config/configs.js');
var logger      = require('../modules/logger.js')('users', configs.logs.users);
var bCrypt      = require('bcrypt-nodejs');


module.exports = function(passport){
	/* GET login page. */
	router.get('/login', function(req, res, next) {
		res.render('auth/login', {page_title: 'Login'});
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

	    if(req.session.after_login_url) {
	    	var success_redirect = req.session.after_login_url;
	    } else {
	    	var success_redirect = '/dashboard';
	    }
		
		passport.authenticate('login', {
			successRedirect: success_redirect,
			failureRedirect: '/users/login',
			failureFlash : true  
		})(req, res, next);
	
	});

	/* GET Registration Page */
	router.get('/signup', function(req, res){
		res.render('auth/signup', {page_title: 'Register'});
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
		res.render('auth/forgotpassword', {page_title: 'Forgot password'});
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
				            logger('error','Error saving user');
				            logger('error',err);
				        }
						done(err, token, user);
				    });
				});

			},
			function(token, user, done) {
        var email_data = {
            email: user.email,
            token: token,
            name: user.name
          };

			  Mailer.sendOne("users/forgot_password", email_data,function(err,res){
					if(err){
						logger('error', 'Error sending email');
						logger('error', err);
					}else{
						logger('info', 'Sent email for forgot password');
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
	      token: req.params.token,
        page_title: 'Reset password'
	    });
	  });
	});

	router.post('/reset/:token', function(req, res) {

    req.check('password', 'The password is required').notEmpty();
	req.check('password_confirmation', 'The password confirmation is required').notEmpty();
    req.check('password_confirmation', 'The password confirmation is not the same as password').equals(req.body.password);
    
    var errors = req.validationErrors();

    if(errors) {
    	logger('error', 'Error reseting password');
    	req.flash('error_messages', errors);
    	return res.redirect('/users/reset/' + req.params.token );    
    }    


	  async.waterfall([
	    function(done) {
	      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
	        if (!user) {
	        	    	logger('error', 'Password reset token is invalid or has expired');
	          req.flash('error_messages', 'Password reset token is invalid or has expired.');
	          return res.redirect('back');
	        }

	        user.password = createHash(req.body.password);
	        user.resetPasswordToken = undefined;
	        user.resetPasswordExpires = undefined;

	        user.save(function(err) {
	        	if(err){
	        		logger('error', 'Error saving user atributes');
	        		logger('error', err);
	        	}
	          req.logIn(user, function(err) {
	          	if(err){
					logger('error', 'Error saving user atributes');
					logger('error', err);
	          	}
	            done(err, user);
	          });
	        });
	      });
	    },
	    function(user, done) {

        var mail_data = {
          email: user.email,
          name: user.name
        };
	     	
	     	Mailer.sendOne("users/password_reset_success", mail_data, function(err,res){
				if(err){
					logger('error', 'Error sending email');
					logger('error', err);
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
		res.render('users/view', { user: req.user, page_title: 'User Settings' });
	});

	router.get('/settings/edit', middlewares.isAuthenticated, function(req, res){
		res.render('users/edit', { user:req.user, page_title: 'Edit User Settings' });
	});

	router.post('/update', middlewares.isAuthenticated, function(req, res){
	
	req.check('name', 'Your name is required').notEmpty();
    req.check('email', 'A valid email is required').isEmail();

    if(req.body.password != '') {
    	//TODO min pass length
	    req.check('password_confirmation', 'The password confirmation is required').notEmpty();
	    req.check('password_confirmation', 'The password confirmation is not the same as password').equals(req.body.password);
	    
    }

    var errors = req.validationErrors();


    var updated_user = { name: req.body.name, email: req.body.email, twitter: req.body.twitter, phone : req.body.phone };
     
    if(errors){  
    	logger('error', errors);
    	req.flash('error_messages', errors);
    	return res.redirect('/users/settings/edit'); 
    } 
   	if(req.body.password != '') {
			var temp_pass = createHash(req.body.password); 
			updated_user['password'] = temp_pass;
   	}

		User.update({_id:req.user.id}, updated_user, { multi: false }, function(err, numa){
			
			var user = req.user;
			user.name = req.body.name;
			user.email = req.body.email;
			user.twitter = req.body.twitter;
			user.phone = req.body.phone;

			req.logIn(user, function(error) {
            if (!error) {	
            		req.flash('success_messages', 'User updated.');
            		res.redirect('/users/settings');
	            }
	        else{
	        	logger('error', error);
	        }
	        });
		});

	});

	var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

	return router;
}
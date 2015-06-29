var express = require('express');
	var router = express.Router();

module.exports = function(passport){

	/* GET login page. */
	router.get('/login', function(req, res, next) {
		res.render('auth/login', { message: req.flash('message') });
	});

	/* Handle Login POST */
	router.post('/login', function(req, res, next){
			
		req.check('username', 'A valid email is required').isEmail();
        req.check('password', 'A password is required').notEmpty();
        
        var errors = req.validationErrors(true);

        if(errors){   //No errors were found.  Passed Validation!
        	console.log(errors);
        	console.log(Object.keys(errors).length);
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
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/dashboard',
		failureRedirect: '/users/signup',
		failureFlash : true  
	}));

	/* Handle Logout */
	router.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	return router;
}
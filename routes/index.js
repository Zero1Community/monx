var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/users/login');
}

/* GET home page. */
router.get('/dashboard', isAuthenticated, function(req, res, next) {
  	res.render('dashboard');
});

router.get('/', function(req, res, next){
	res.render('home');
});

module.exports = router;

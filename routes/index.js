var express = require('express');
var router = express.Router();
var m  = require('../middlewares/middlewares.js');

/* GET home page. */
router.get('/dashboard', m.isAuthenticated, function(req, res, next) {
  	res.render('dashboard');
});

router.get('/', function(req, res, next){
	res.render('home');
});

module.exports = router;

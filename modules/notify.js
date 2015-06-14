var Mailer = require('./mailer.js');
var Notification = require('../models/notification.js');
var User = require('../models/user.js');

//to be deleted
var mongoose = require('mongoose');
var dbConfig = require('../config/db.js');

function notify(data) {
	console.log('notify');
	mongoose.connect(dbConfig.url);
	User.findOne({_id: data.user_id}, function(err, user){
		console.log(err);
		console.log(user);

	});

}

module.exports = notify;
var Mailer = require('./mailer.js');

var data = {
	email: 'tuwi.dc@gmail.com',
	subject: 'testtttt sub'
};


Mailer.sendOne('newsletter', data, function(err, res){

	if(err) {
		console.log(err);
		return;
	}
	console.log(res);

});
var Mailer = require('./mailer.js');

var many_data = [
	{
		email: 'tuwi.dc@gmail.com',
		subject: 'testtttt sub'
	},
	{
		email: 'agli@zero1.al',
		subject: 'agli test'
	},
	{
		email: 'a.gli.panci@gmail.com',
		subject: 'agligmail'
	},
];


Mailer.sendMany('newsletter', many_data, function(err, res){

	if(err) {
		console.log(err);
		return;
	}
	console.log(res);

});
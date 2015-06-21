var Notify = require('./mailer.js');
var configs = require('../config/configs.js');

var tick = {
	message : "Si karuat mire ?",
	subject : "mirbrenda",
	name : "BabaMondi",
	email : 'tuwi.dc@gmail.com'
}

Notify.sendOne("newsletter",tick,function(err,res){
		if(err){
			console.log(err);
		}else{
			console.log(res);
		}
});

var rblcheck = require('../modules/checkBlacklist.js');

rblcheck('mail.alsat.tv', function(res){
	console.log(res);
});
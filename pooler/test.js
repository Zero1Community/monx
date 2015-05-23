var rblcheck = require('../modules/checkBlacklist.js');

rblcheck('www.google.com', function(res){
	console.log(res);
});
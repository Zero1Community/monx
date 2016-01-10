// http status module
function monxHttpStatus(httpStatObject){
	var checkHttpStatus = require('../modules/checkHttpStatus.js');
	checkHttpStatus(httpStatObject.url,8000,function(data){
		// duhet fut timeout
		console.log(data);
	});

/* 	var data = {
			message: {

			},
			status: stat,
			service_id: blacklistObject._id,
			user: blacklistObject.user
		} */

}



var ZeLink = {
	url : 'http://mondi.com/a'
};

monxHttpStatus(ZeLink);
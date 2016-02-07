var http_status = require('../modules/checkHttpStatus.js');

var data ={
	host : 'https://crm.wki.it/',
	protocol : 'https',
	options : {
		ignore_ssl_issues : true
	}
}

setInterval(function(){

  http_status(data, 2000, function(e, d){
    if(e){
    	console.log(e);
    }
    else{
    console.log(d);
    }
  });
}, 1000);

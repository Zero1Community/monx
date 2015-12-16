var configs  = require('../config/configs.js');
var logger   = require('../modules/logger.js')('httpstatus', configs.logs.httpstatus);

function checkHttpStatus(URL, timeout, cb) {
//	var URL = 'https://www.google.com/';

	var requester = URL.match(/^https(.*)/) ? require('https') : require('http');

	requester.get(URL, function(res) {
	//  console.log("statusCode: ", res.statusCode); 
	//  console.log("headers: ", res.headers);

	  res.on('data', function(d) {
		//console.log('got some data');
		//process.stdout.write(d);
	  });

	  if(res.statusCode >= 600 && res.statusCode < 100){
		  // invalid
		  console.log('Invalid code ',res.statusCode); 
		  cb({ message : 'Invalid code ',status_code : res.statusCode, status: 'Error'} ); 
	  }
	 if(res.statusCode >= 500 && res.statusCode < 600){
		  // not found
		  console.log('Not found,  Got code: ',res.statusCode); 
		  cb({ message : 'Internal Server Error ',status_code : res.statusCode, status: 'Error'} ); 
	  }

	  if(res.statusCode >= 400 && res.statusCode < 500){
		  // not found
		  console.log('Not found,  Got code: ',res.statusCode); 
		  cb({ message : 'Not found ',status_code : res.statusCode, status: 'Error'} ); 
	  }
	  
	  if(res.statusCode >= 300 && res.statusCode < 400){
		  // not found
		  console.log('Redirect,  Got code: ',res.statusCode);
		  cb({ message :'Redirect',status_code : res.statusCode, status: 'Error'} );
		  
	  }
	  if(res.statusCode >= 200 && res.statusCode < 300){
		  // not found
		  console.log('Status OK,  Got code: ',res.statusCode); 
		  cb({message: 'Status OK', status_code : res.statusCode, status: 'OK'}); 
	  }

	}).on('error', function(e) {
		// dns issue me { [Error: getaddrinfo ENOTFOUND www.google.coma www.google.coma:80]
	  if(e.errno == 'ECONNRESET' || e.errno == 'ECONNREFUSED' ){
		  // probl firewalli
		  console.log('Connection reset/refused  / Firewall Issue');
		  cb({message: 'Connection reset/refused  / Firewall Issue', status_code: '-1', status: 'Error'});
	  }
	  else if( e.errno == 'ENOTFOUND' ){
		// probl dns  
		  console.log('Unable to resolve host  / DNS Issue');
		  cb({message: 'Unable to resolve host  / DNS Issue', status_code: '-2', status: 'Error'});
	  }
	  else if( e.errno == 'ETIMEDOUT' ){
		  // timeout 
		  console.log('Connection timeout  / Port|TCP|Host Issue');
		  cb({message: 'Connection timeout  / Port|TCP|Host Issue', status_code: '-3', status: 'Error'});
	  }
	  else if( e.errno == 'EHOSTUNREACH' ){
		  //
		  console.log('Destination host unreachable  / Network Issue');
		  cb({message:'Destination host unreachable  / Network Issue', status_code: '-4', status: 'Error'});
	  }
	  else{
		  console.log('Unhandle Issue  / Issue');
		  cb({message: 'Unhandle Issue  / Issue', status_code: '-5', status: 'Error'});
		  // nej error i cuditshem
		//ESOCKETTIMEDOUT,  EPIPE, EAI_AGAIN
	  } 
	  //console.log(e);
	});
}

module.exports = checkHttpStatus;
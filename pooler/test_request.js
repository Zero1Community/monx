var URL = 'https://www.google.com/';


var requester = URL.match(/^https(.*)/) ? require('https') : require('http');

requester.get(URL, function(res) {
//  console.log("statusCode: ", res.statusCode); 
//  console.log("headers: ", res.headers);

  res.on('data', function(d) {
    //console.log('got some data');
	//process.stdout.write(d);
  });

  if(res.statusCode >= 400 && res.statusCode < 500){
	  // not found
	  console.log('Not found,  Got code: ',res.statusCode); 
  }
  
  if(res.statusCode >= 300 && res.statusCode < 400){
	  // not found
	  console.log('Redirect,  Got code: ',res.statusCode); 
  }
  if(res.statusCode >= 200 && res.statusCode < 300){
	  // not found
	  console.log('Status OK,  Got code: ',res.statusCode); 
  }

  
  
}).on('error', function(e) {
	// dns issue me { [Error: getaddrinfo ENOTFOUND www.google.coma www.google.coma:80]
  if(e.errno == 'ECONNRESET' || e.errno == 'ECONNREFUSED' ){
	  // probl firewalli
	  console.log('Connection reset/refused  / Firewall Issue');
  }
  else if( e.errno == 'ENOTFOUND' ){
	// probl dns  
	  console.log('Unable to resolve host  / DNS Issue');
  }
  else if( e.errno == 'ETIMEDOUT' ){
	  // timeout 
	  console.log('Connection timeout  / Port|TCP|Host Issue');
  }
  else if( e.errno == 'EHOSTUNREACH' ){
	  //
	  console.log('Destination host unreachable  / Network Issue');
  }
  else{
	  console.log('Unhandle Issue  / Issue');
	  // nej error i cuditshem
	//ESOCKETTIMEDOUT,  EPIPE, EAI_AGAIN
  } 
  //console.log(e);
});
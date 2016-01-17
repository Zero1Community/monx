var configs  = require('../config/configs.js');
var logger   = require('../modules/logger.js')('http_status', configs.logs.http_status);
var url = require('url');

function checkHttpStatus(URL, timeout, cb) {

  var url_data = url.parse(URL, true);

  var http = url_data.protocol.match(/^https(.*)/) ? require('https') : require('http');
  var request = require('request');

  var options = {
    url: URL,
    agent: new http.Agent({keepAlive:false}),
  };

  request.get(options, function(error, res) {
    //  console.log("statusCode: ", res.statusCode);
    //  console.log("headers: ", res.headers);

    if(res.statusCode >= 600 && res.statusCode < 100){
      // invalid
      console.log('Invalid code ', res.statusCode);
      cb({message: 'Invalid code ', status_code: res.statusCode, status: 'ERROR'});
    }
    if(res.statusCode >= 500 && res.statusCode < 600){
      // not found
      console.log('Not found,  Got code: ', res.statusCode);
      cb({message: 'Internal Server Error ', status_code: res.statusCode, status: 'ERROR'});
    }

    if(res.statusCode >= 400 && res.statusCode < 500){
      // not found
      console.log('Not found,  Got code: ', res.statusCode);
      cb({message: 'Not found ', status_code: res.statusCode, status: 'ERROR'});
    }

    if(res.statusCode >= 300 && res.statusCode < 400){
      // not found
      console.log('Redirect,  Got code: ',res.statusCode);
      cb({message: 'Redirect', status_code: res.statusCode, status: 'ERROR'});

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
      console.log('Connection reset/refused  / Firewall Issue' + e);
      cb({message: 'Connection reset/refused  / Firewall Issue', status_code: '-2', status: 'ERROR'});
    }
    else if( e.errno == 'ENOTFOUND' ){
      // probl dns
      console.log('Unable to resolve host  / DNS Issue' + e);
      cb({message: 'Unable to resolve host  / DNS Issue', status_code: '-3', status: 'ERROR'});
    }
    else if( e.errno == 'ETIMEDOUT' ){
      // timeout
      console.log('Connection timeout  / Port|TCP|Host Issue' + e);
      cb({message: 'Connection timeout  / Port|TCP|Host Issue', status_code: '-4', status: 'ERROR'});
    }
    else if( e.errno == 'EHOSTUNREACH' ){
      //
      console.log('Destination host unreachable  / Network Issue' + e);
      cb({message: 'Destination host unreachable  / Network Issue', status_code: '-5', status: 'ERROR'});
    }
    else{
      console.log('Unhandled Issue  / Issue' + e);
      cb({message: 'Unhandled Issue  / Issue', status_code: '-6', status: 'ERROR'});
      // nej error i cuditshem
      //ESOCKETTIMEDOUT,  EPIPE, EAI_AGAIN
    }
    //console.log(e);
  });
}

module.exports = checkHttpStatus;
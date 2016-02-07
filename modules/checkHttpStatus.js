var configs  = require('../config/configs.js');
var logger   = require('../modules/logger.js')('http_status', configs.logs.http_status);
var url = require('url');

function checkHttpStatus(data, timeout, cb) {

  var url_data = url.parse(data.host, true);
  //console.log(data.options);
  var http = url_data.protocol.match(/^https(.*)/) ? require('https') : require('http');
  var request = require('request');

  var options = {
    url: data.host,
    agent: new http.Agent({keepAlive:false}),
  };

  if(url_data.protocol.match(/^https(.*)/)) {
    // error i cuditshem
    if(data.options){
      if(data.options['ignore_ssl_issues'])
      options.strictSSL = false;
      console.log('We got ignore_ssl_issues flag, setting flag ' + options.strictSSL);
    } 
    else{
      options.strictSSL = true;
    }
  }else{
    console.log('We didnt get ignore_ssl_issues flag ');
  }

  request.get(options, function(e, res) {
    if(e) {
        //console.log(e.code);
      if (e.code == 'ECONNRESET' || e.code == 'ECONNREFUSED') {
        // probl firewalli
        console.log('Connection reset/refused  / Firewall Issue ' + e.code );
          return cb({message: 'Connection reset/refused  / Firewall Issue ', status_code: '-2', status: 'ERROR'});
      }
      else if (e.code == 'ENOTFOUND') {
        // probl dns
        console.log('Unable to resolve host  / DNS Issue ' + e.code );
          return cb({message: 'Unable to resolve host  / DNS Issue ', status_code: '-3', status: 'ERROR'});
      }
      else if (e.code  == 'ETIMEDOUT') {
        // timeout
        console.log('Connection timeout  / Port|TCP|Host Issue ' + e.code );
          return cb({message: 'Connection timeout  / Port|TCP|Host Issue ', status_code: '-4', status: 'ERROR'});
      }
      else if (e.code == 'EHOSTUNREACH') {
        //
        console.log('Destination host unreachable  / Network Issue ' + e.code );
          return cb({message: 'Destination host unreachable  / Network Issue ', status_code: '-5', status: 'ERROR'});
      }
      else {
        console.log('Unhandled Issue  / Issue ' + e.code );
        return cb({message: 'Unhandled Issue  / Issue ', status_code: '-6', status: 'ERROR'});
        // nej error i cuditshem
        //ESOCKETTIMEDOUT,  EPIPE, EAI_AGAIN
      }
      //console.log(e);
    }
    else{
      var messageC = '';
      if(res.statusCode >= 600 && res.statusCode < 100){
        // invalid
        console.log('Invalid code ', res.statusCode);
        return cb({message: 'Invalid code ', status_code: res.statusCode, status: 'ERROR'});
      }
      if(res.statusCode >= 500 && res.statusCode < 600){ // to be rechecked
        // internal error
        switch(res.statusCode){
          case 500:
            messageC = 'Bad Request';
            break;
          case 500:
            messageC = 'Bad Request';
            break;
          case 500:
            messageC = 'Bad Request';
            break;
          case 500:
            messageC = 'Bad Request';
            break;
          case 500:
            messageC = 'Bad Request';
            break;
          case 500:
            messageC = 'Bad Request';
            break;
          case 500:
            messageC = 'Bad Request';
            break;
          case 500:
            messageC = 'Bad Request';
            break;
          case 500:
            messageC = 'Bad Request';
            break;
          case 500:
            messageC = 'Bad Request';
            break;
          case 500:
            messageC = 'Bad Request';
            break;
          default:

        }
        console.log('Not found,  Got code: ', res.statusCode);
        return cb({message: 'Internal Server Error ', status_code: res.statusCode, status: 'ERROR'});
      }

      if(res.statusCode >= 400 && res.statusCode < 500){
        // not found
        switch(res.statusCode){
          case 400:
            messageC = 'Bad Request';
            break;
          case 401:
            messageC = 'Unauthorized';
            break;
          case 402:
            messageC = 'Payment Required';
            break;
          case 403:
            messageC = 'Forbidden';
            break;
          case 404:
            messageC = 'Not Found';
            break;
          case 405:
            messageC = 'Method Not Allowed';
            break;
          case 406:
            messageC = 'Not Acceptable';
            break;
          case 407:
            messageC = 'Proxy Authentication Required';
            break;
          case 408:
            messageC = 'Request Timeout';
            break;
          case 409:
            messageC = 'Conflict';
            break;
          case 410:
            messageC = 'Gone';
            break;
          case 411:
            messageageC = 'Length Required';
            break;
          case 412:
            messageC = 'Precondition Failed';
            break;
          case 413:
            messageC = 'Payload Too Large';
            break;
          case 414:
            messageC = 'URI Too Long';
            break;
          case 415:
            messageC = 'Unsupported Media Type';
            break;
          case 416:
            messageC = 'Range Not Satisfiable';
            break;
          case 417:
            messageC = 'Expectation Failed';
            break;
          default:
            messageC = 'Unassigned 400 ERROR';
          }
        console.log('Not found,  Got code: ', res.statusCode);
        return cb({message: messageC , status_code: res.statusCode, status: 'ERROR'});
      }

      if(res.statusCode >= 300 && res.statusCode < 400){
        // redirect
        switch(res.statusCode){
          case 300:
            messageC = 'Multiple Choices';
            break;
          case 301:
            messageC = 'Moved Permanently';
            break;
          case 302:
            messageC = 'Found';
            break;
          case 303:
            messageC = 'See Other';
            break;
          case 304:
            messageC = 'Not Modified';
            break;
          case 305:
            messageC = 'Use Proxy';
            break;
          case 306:
            messageC = '(Unused) Redirect';
            break;
          case 307:
            messageC = 'Temporary Redirect';
            break;
          case 308:
            messageC = 'Permanent Redirect';
            break;
          default:
            messageC = 'Unassigned 300 Error';
        }

        console.log(messageC + '  Got code: ',res.statusCode);
        return cb({message: messageC, status_code: res.statusCode, status: 'ERROR'});
      }
      if(res.statusCode >= 200 && res.statusCode < 300){
        // ok but not really
        switch(res.statusCode){
          case 200:
            messageC = 'Status OK';
            break;
          case 201:
            messageC = 'Created';
            break;
          case 202:
            messageC = 'Accepted';
            break;
          case 203:
            messageC = 'Non-Authoritative Information';
            break;
          case 204:
            messageC = 'No Content';
            break;
          case 205:
            messageC = 'Reset Content';
            break;
          case 206:
            messageC = 'Partial Content';
            break;
          case 207:
            messageC = 'Multi-Status';
            break;
          case 208:
            messageC = 'Already Reported';
            break;
          default:
            messageC = 'Unassigned 200 Error';
        }

        console.log(messageC +'  Got code: ' + res.statusCode);
        return cb({message: messageC, status_code : res.statusCode, status: 'OK'});
      }
    }
  });
}

module.exports = checkHttpStatus;
var configs  = require('../config/configs.js');

//var logger   = require('../modules/logger.js')('http_status', configs.logs.http_status);
var logger   = require('../modules/logger.js');

var url = require('url');
var request = require('request');
var http_module = require('http');
var https_module = require('https');

function checkHttpStatus(data, timeout, cb) {
	// duke parur errno.h nga headerat e kernelit variojne nga 35 deri te 133 momentalisht 
	// + errorcodet e http 
	var errno_h = {

			EUSERS          :       'Too many users',
			ENOTSOCK        :       'Socket operation on non-socket', 
			EDESTADDRREQ    :       'Destination address required',
			EMSGSIZE        :       'Message too long',
			EPROTOTYPE      :       'Protocol wrong type for socket',
			ENOPROTOOPT     :       'Protocol not available',
			EPROTONOSUPPORT :       'Protocol not supported',
			ESOCKTNOSUPPORT :       'Socket type not supported',
			EOPNOTSUPP      :       'Operation not supported on transport endpoint',
			EPFNOSUPPORT    :       'Protocol family not supported',
			EAFNOSUPPORT    :       'Address family not supported by protocol',
			EADDRINUSE      :       'Address already in use',
			EADDRNOTAVAIL   :       'Cannot assign requested address',
			ENETDOWN        :       'Network is down',
			ENETUNREACH     :       'Network is unreachable',
			ENETRESET       :       'Network dropped connection because of reset',
			ECONNABORTED    :       'Software caused connection abort',
			ECONNRESET      :       'Connection reset by peer',
			ENOBUFS         :       'No buffer space available',
			EISCONN         :       'Transport endpoint is already connected',
			ENOTCONN        :       'Transport endpoint is not connected',
			ESHUTDOWN       :       'Cannot send after transport endpoint shutdown',
			ETOOMANYREFS    :       'Too many references: cannot splice',
			ETIMEDOUT       :       'Connection timed out',
			ECONNREFUSED    :       'Connection refused',
			EHOSTDOWN       :       'Host is down',
			EHOSTUNREACH    :       'No route to host',
			EALREADY        :       'Operation already in progress',
			EINPROGRESS     :       'Operation now in progress',
			ESTALE          :       'Stale file handle',
			EUCLEAN         :       'Structure needs cleaning', 
			ENOTNAM         :       'Not a XENIX named type file', 
			ENAVAIL         :       'No XENIX semaphores available',
			EISNAM          :       'Is a named type file',
			EREMOTEIO       :       'Remote I/O error',
			EDQUOT          :       'Quota exceeded',
			ENOTFOUND			  : 			'Unable to resolve host',
			
			200: 'Status OK',
			201: 'Created',
			202: 'Accepted',
			203: 'Non-Authoritative Information',
			204: 'No Content',
			205: 'Reset Content',
			206: 'Partial Content',
			207: 'Multi-Status',
			208: 'Already Reported',

			300: 'Multiple Choices',
			301: 'Moved Permanently',
			302: 'Found',
			303: 'See Other',
			304: 'Not Modified',
			305: 'Use Proxy',
			306: '(Unused) Redirect',
			307: 'Temporary Redirect',
			308: 'Permanent Redirect',

			400: 'Bad Request',
			401: 'Unauthorized',
			402: 'Payment Required',
			403: 'Forbidden',
			404: 'Not Found',
			405: 'Method Not Allowed',
			406: 'Not Acceptable',
			407: 'Proxy Authentication Required',
			408: 'Request Timeout',
			409: 'Conflict',
			410: 'Gone',
			411: 'Length Required',
			412: 'Precondition Failed',
			413: 'Payload Too Large',
			414: 'URI Too Long',
			415: 'Unsupported Media Type',
			416: 'Range Not Satisfiable',
			417: 'Expectation Failed',

			420: 'Method Failure (Spring Framework) | Enhance Your Calm (Twitter)',
			421: 'Misdirected Request',
			422: 'Unprocessable Entity',
			423: 'Locked',
			424: 'Failed Dependency',
			426: 'Upgrade Required',
			428: 'Precondition Required',
			429: 'Too Many Requests',

			431: 'Request Header Fields Too Large',
			440: 'IIS Login Timeout',
			449: 'IIS Retry With',
			450: 'IIS Blocked by Windows Parental Controls (Microsoft)',
			451: 'Unavailable for Legal Reasons || IIS Redirect',

			498: 'Invalid Token (Esri)',
			499: 'Token Required (Esri)',

			500: 'Internal Server Error',
			501: 'Not Implemented',
			502: 'Bad Gateway',
			503: 'Service Unavailable',
			504: 'Gateway Timeout',
			505: 'HTTP Version Not Supported',
			506: 'Variant Also Negotiates',
			507: 'Insufficient Storage',
			508: 'Loop Detected',
			509: 'Bandwidth Limit Exceeded (Apache Web Server/cPanel)',
			510: 'Not Extended',
			511: 'Network Authentication Required',

			520: 'CloudFlare Unknown Error',
			521: 'CloudFlare Web Server Is Down',
			522: 'CloudFlare Connection Timed Out',
			523: 'CloudFlare Origin Is Unreachable',
			524: 'CloudFlare A Timeout Occurred',
			525: 'CloudFlare SSL Handshake Failed',
			526: 'CloudFlare Invalid SSL Certificate'

	};

	var url_data = url.parse(data.host, true);
	//console.log(data.options);
	var http = url_data.protocol.match(/^https(.*)/) ? https_module : http_module;

	var options = {
		url: data.host,
		agent: new http.Agent({keepAlive:false}),
	};

	if(url_data.protocol.match(/^https(.*)/)) {
		//TODO: review this
		if(data.options){
			if(data.options['ignore_ssl_issues'])
			options.strictSSL = false;
			logger('debug','We got ignore_ssl_issues flag, setting flag ' + options.strictSSL);
		} 
		else{
			options.strictSSL = true;
		}
	}else{
		logger('debug','We didnt get ignore_ssl_issues flag ');
		}

	request.get(options, function(e, res, body) {
		if(e) {
			if (errno_h[e.code]){
				logger('debug', errno_h[e.code] + ' ' + e.code );
				return cb({message: errno_h[e.code] , status_code: e.code, status: 'ERROR'});
			} 
			else {
				logger('debug','Connection Issue ' + e.code );
				return cb({message: 'Connection Issue ' + e.code, status_code: e.code, status: 'ERROR'});
			}
		}
		else{
			if(res.statusCode >= 600 && res.statusCode < 100){
				// invalid
				logger('debug','Invalid Status Code ' + res.statusCode);
				return cb({message: 'Invalid Status Code ', status_code: res.statusCode, status: 'ERROR', dump : body});
			}
			if(res.statusCode >= 500 && res.statusCode < 600){ // to be rechecked
				// internal error
				if(errno_h[res.statusCode]){
					logger('debug', errno_h[res.statusCode] + '  Got code: '+ res.statusCode);
					return cb({message: errno_h[res.statusCode] , status_code: res.statusCode, status: 'ERROR', dump : body});
				}
				else{
					logger('debug','Server Error,  Got code: '+ res.statusCode);
					return cb({message: 'Server Error,  Got code: '+ res.statusCode, status_code: res.statusCode, status: 'ERROR', dump : body});
				}
			}

			if(res.statusCode >= 400 && res.statusCode < 500){
				// not found
				if(errno_h[res.statusCode]){
					logger('debug', errno_h[res.statusCode] + '  Got code: ' + res.statusCode);
					return cb({message: errno_h[res.statusCode] , status_code: res.statusCode, status: 'ERROR', dump : body});
				}	
				else{
					logger('debug','Client-Server Error ,  Got code: ' + res.statusCode);
					return cb({message: 'Client-Server Error ,  Got code: ' + res.statusCode , status_code: res.statusCode, status: 'ERROR', dump : body});
				}			
			}

			if(res.statusCode >= 300 && res.statusCode < 400){
				// redirect, we're not supposed to get these after enabling Follow Link 
				if(errno_h[res.statusCode]){
					logger('debug',errno_h[res.statusCode] + '  Got code: ' + res.statusCode);
					return cb({message: errno_h[res.statusCode], status_code: res.statusCode, status: 'ERROR', dump : body});
				}
				else{
					logger('debug','Redirect Error' + '  Got code: ' + res.statusCode);
					return cb({message: 'Redirect Error' + '  Got code: ' + res.statusCode, status_code: res.statusCode, status: 'ERROR', dump : body});
				}
			}
			if(res.statusCode >= 200 && res.statusCode < 300){
				if(errno_h[res.statusCode]){
					if(res.statusCode == 200){
						logger('debug','Status OK ' + '  Got code: ' + res.statusCode);
						return cb({message: 'Status OK ', status_code : res.statusCode, status: 'OK'});
					}
					else{
						logger('debug', errno_h[res.statusCode] + '  Got code: ' + res.statusCode);
						return cb({message: errno_h[res.statusCode] + '  Got code: ' + res.statusCode, status_code : res.statusCode, status: 'ERROR',dump : body});						
					}
				}
				else{
						logger('debug', 'Unexpected status code, ' + '  Got code: ' + res.statusCode);
						return cb({message: 'Unexpected status code, ' + res.statusCode , status_code : res.statusCode, status: 'ERROR', dump : body});						
				}
			}
		}
	});
}

module.exports = checkHttpStatus;
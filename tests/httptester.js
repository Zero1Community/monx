var http = require('https');

var postData = {
  data : {
    message: 'as',
    status: 'ssss',
    service_id: '123',
    user: '3',
    status_code: 34324,
    name: 'sss'
  }
};

var options = {
  hostname: 'monx.me',
  path: '/api/service-data/add',
  post: 443,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': postData.length
  }
};

http.request(options, function(err, res){
  console.log(err);
  console.log(res);
}).write(postData);
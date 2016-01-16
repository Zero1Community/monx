var http_status = require('../modules/checkHttpStatus.js');

setInterval(function(){

  http_status('https://aglipanci.com/monx/', 2000, function(e, d){
    console.log(e);
    console.log(d);
  });
}, 1000);

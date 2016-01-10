var Twit = require('twit');

var T = new Twit({
  consumer_key: '3WobBbsfzflYkCVoJu4Jme4ei',
  consumer_secret: 'IWZJukKXKUwsI4RDMC8D6zqlY6QHTkIxTY06QhdGTNlyT7sl6g',
  access_token: '393450036-8lPqFgDOXPMJhBv7LbOvPnWPrsH7R2uSzz9O88Lv',
  access_token_secret: 'ylZMv1CBIOAhUWw8N81BuZc6kYXelyoo2c1npjz1Zv76M'  
});

//
//  tweet 'hello world!'
//
T.post('statuses/update', { status: 'hello world!' }, function(err, reply) {
  if(err){
  	console.log(err);
  } else {
  	console.log("posted some stuff");
  }
});
var when = require('when');
var amqp = require('amqplib');
var logger = require('../modules/logger.js')('workEmmit', configs.logs.emmiter_lib);


function workEmmiter(jobToDo,queue){

  amqp.connect('amqp://localhost').then(function(conn) {
    return when(conn.createChannel().then(function(ch) {

      var q = queue;
      var ok = ch.assertQueue(q, {durable: false});

      return ok.then(function(_qok) {
        ch.sendToQueue(q, new Buffer(JSON.stringify(jobToDo)));
        logger('info',' [x] Sent job to rabbitMQ queue '+ queue);
        return ch.close();
      });
    })).ensure(function() { conn.close(); });;
  }).then(null, console.warn);
}

module.exports = workEmmiter;
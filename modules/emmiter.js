var when    = require('when');
var amqp    = require('amqplib');
var configs = require('../config/configs.js');
var logger  = require('../modules/logger.js')('emmiter_lib', configs.logs.emmiter_lib);

function workEmmiter(jobToDo,queue){

  amqp.connect(configs.rabbitmq.url).then(function(conn) {
    return when(conn.createChannel().then(function(ch) {

      var q = queue;
      var ok = ch.assertQueue(q, {durable: false});

      return ok.then(function(_qok) {
        ch.sendToQueue(q, new Buffer(JSON.stringify(jobToDo)));
        logger('info',' [x] Sent job to rabbitMQ queue '+ queue + ' with configured interval ' + jobToDo.interval);
        return ch.close();
      });
    })).ensure(function() { conn.close(); });
    //TODO error handle + ca eshte kjo consoli ktu ?
  }).then(null, console.warn);
}

module.exports = workEmmiter;
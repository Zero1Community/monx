var when = require('when');
var amqp = require('amqplib');
var configs = require('../config/configs.js');

var mongoose = require('mongoose');
var User = require('../models/user.js');
var dbConfig = require('../config/db.js');
var Service = require('../models/service.js');


function workEmmiter(jobToDo){

  amqp.connect('amqp://localhost').then(function(conn) {
    return when(conn.createChannel().then(function(ch) {

      var q = 'service_updates';
      var ok = ch.assertQueue(q, {durable: false});

      return ok.then(function(_qok) {
        ch.sendToQueue(q, new Buffer(JSON.stringify(jobToDo)));
        if(configs.debug) console.log(" [x] Sent job to rabbitMQ");
        return ch.close();
      });
    })).ensure(function() { conn.close(); });;
  }).then(null, console.warn);
}

task = { _id: '55c7bf565e2a379306bc5db4',
  user: '55662ee347848748120601b4',
  running_status: true,
  interval: 5,
  type: 'blacklist',
  host: 'mail.duapune.com',
  name: 'duapune',
  status: 'ERROR',
  notification_status: { mute: true } 
}

workEmmiter(task);
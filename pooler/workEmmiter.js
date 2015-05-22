#!/usr/bin/env node

var amqp = require('amqplib');
var when = require('when');

amqp.connect('amqp://localhost').then(function(conn) {
  return when(conn.createChannel().then(function(ch) {
    var q = 'all_checks';
    var msg = {
    	host : "127.0.0.1",
    	port : "25",
    	type : "smtp_check"
    };
    console.log(msg);
    var ok = ch.assertQueue(q, {durable: false});
    
    return ok.then(function(_qok) {
      ch.sendToQueue(q, new Buffer(JSON.stringify(msg)));
      console.log(" [x] Sent "+ msg);
      console.log(msg);
      return ch.close();
    });
  })).ensure(function() { conn.close(); });;
}).then(null, console.warn);

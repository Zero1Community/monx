#!/usr/bin/env node

var amqp = require('amqplib');
var when = require('when');

var jobs = [];

// morim nga db-ja kto 
// per cdo tick sipas intervalit bejme emit ne queue 

jobs[0] = {
      id : "tatumblablalsad",
      ip : "79.109.1.100",
      type : "blacklist_check",
      interval : 60
    };
jobs[1] = {
      id : "lablsadadiaiywrn",
      host : "mail.zero1.al",
      port : "25",
      type : "smtp_check"
      interval : 10
    };
jobs[2] = {
      id : "tbujnjymtn78yn8iklk"
      host : "mail.zero1.al",
      port : "110",
      type : "pop_check"
      interval : 10
    };


amqp.connect('amqp://localhost').then(function(conn) {
  return when(conn.createChannel().then(function(ch) {
    var q = 'all_checks';
    var msg = {
    	ip : "79.109.1.100",
    	//port : "110",
    	type : "blacklist_check"
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

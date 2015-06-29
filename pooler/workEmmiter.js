#!/usr/bin/env node

var when = require('when');
var amqp = require('amqplib');
var configs = require('../config/configs.js');

var mongoose = require('mongoose');
var User = require('../models/user.js');
var dbConfig = require('../config/db.js');
var Service = require('../models/service.js');

// kjo duhet bo me .then()
mongoose.connect(dbConfig.url);
Service.find({}, function(err, services) {
    if(configs.debug) console.log(services);
    scheduler(services);
    mongoose.connection.close();
});

function scheduler(taskList){
  if(configs.debug) console.log('Got service from DB', taskList);
  taskList.forEach(function(task){
    setInterval(function(task) {
          //let's emmit the work on RabbitMQ
          workEmmiter(task);
          if(configs.debug) console.log(task);
    }, task.interval*1000, task);
  });
}

function workEmmiter(jobToDo){

  amqp.connect('amqp://localhost').then(function(conn) {
    return when(conn.createChannel().then(function(ch) {

      var q = 'all_checks';
      var ok = ch.assertQueue(q, {durable: false});

      return ok.then(function(_qok) {
        ch.sendToQueue(q, new Buffer(JSON.stringify(jobToDo)));
        if(configs.debug) console.log(" [x] Sent job to rabbitMQ");
        return ch.close();
      });
    })).ensure(function() { conn.close(); });;
  }).then(null, console.warn);

}


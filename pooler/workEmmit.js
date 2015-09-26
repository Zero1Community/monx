#!/usr/bin/env node

var when = require('when');
var amqp = require('amqplib');
var configs = require('../config/configs.js');

var mongoose = require('mongoose');
var User = require('../models/user.js');
var dbConfig = require('../config/db.js');
var Service = require('../models/service.js');

var intervals = [];
var total_services = [];
// kjo duhet bo me .then()
var workEmmiter = require('../modules/emmiter.js');

function scheduler(taskList){
  console.log('Hyme ne scheduler');
  taskList.forEach(function(task){
  console.log('Creating interval with ID ' + task._id);
  //TODO: kjo duhet me .then qe te mos ta bukosim queuen OSE
  // me limit OSE 
  // me IP rotation 
  //workEmmiter(task,'all_checks');
  intervals[task._id] = setInterval(function(task) {
          console.log('Po monitorojme '+ task.name);
          console.log('Me interval '+ task.interval);
          workEmmiter(task,'all_checks');
    }, task.interval*1000, task);
  });
}

function DbUpdateServices () {
  mongoose.connect(dbConfig.url);
  console.log('Duke marre nga DB');
  Service.find({running_status : true}, function(err, services) {
      //if(configs.debug) console.log(services);
      scheduler(services);
      mongoose.connection.close();
  });
}

function startInterval (rabbit_task) {
          //if(configs.debug) console.log(services);
      clearInterval(intervals[rabbit_task._id]);
          if(rabbit_task.running_status == true){
              console.log('Creating interval with ID ' + rabbit_task._id);
              intervals[rabbit_task._id] = setInterval(function(rabbit_task) {
                      //let's emmit the work on RabbitMQ
                      console.log('Po monitorojme '+ rabbit_task.name);
                      console.log('Me interval '+ rabbit_task.interval);
                      workEmmiter(rabbit_task,'all_checks');
                      //if(configs.debug) console.log(task);
                }, rabbit_task.interval*1000, rabbit_task);          
          }
}



DbUpdateServices();

amqp.connect('amqp://localhost').then(function(conn) {
  process.once('SIGINT', function() { conn.close(); });
  return conn.createChannel().then(function(ch) {
    
    var ok = ch.assertQueue('service_updates', {durable: false});
    // todo : error catching per kur nuk lidhet queueja 
    ok = ok.then(function(_qok) {
      return ch.consume('service_updates', function(msg) {
        if(configs.debug) console.log(" [x] Received a service update task");
        var toCheck = JSON.parse(msg.content.toString());
        //if(configs.debug) console.log(toCheck);
        startInterval(toCheck);
        workEmmiter(task,'all_checks');
        //if(configs.debug) console.log(msg);
      }, {noAck: true});
    });

    return ok.then(function(_consumeOk) {
      if(configs.debug) console.log(' [*] Waiting for messages. To exit press CTRL+C');
    });
  });
}).then(null, console.warn);

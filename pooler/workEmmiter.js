#!/usr/bin/env node

var amqp = require('amqplib');
var when = require('when');

var mongoose = require('mongoose');
dbConfig = require('../config/db.js');
var Service = require('../models/service.js');
var User = require('../models/user.js');
//console.log("U lidhem");

// kjo duhet bo me .then()
mongoose.connect(dbConfig.url);
//Service.find({}).populate('user').exec(function(err, services) {
Service.find({}, function(err, services) {
    console.log(services);
    scheduler(services);
    //var userMap = {};
    // if(err){
    //   console.log(err);
    // }

    services.forEach(function(service) {
      //console.log(user);
      console.log(service.type);
      console.log(service.host);
     // scheduler(service);
      //console.log(service.user);
      // console.log(userMap[user._id]);
      // console.log(userMap[user.type]);
    });
    // duhet kjo me verte ?
    mongoose.connection.close();
});



function scheduler(taskList){
  // si ka mundesi qe jam kaq i trishte ne debug
  console.log("na erdhen gjona");
 console.log(taskList);
  taskList.forEach(function(task){
    setInterval(function(task) {
          workEmmiter(task);
          console.log(task);
          //console.log(str1 + " " + str2);
    }, task.interval*1000, task);
  });
}


function workEmmiter(jobToDo){

  amqp.connect('amqp://localhost').then(function(conn) {
    return when(conn.createChannel().then(function(ch) {
      var q = 'all_checks';

      var msg = {
        host : "mail.bwbalkans.al",
        port : "26",
        interval: 5,
        type : "smtp_check"
      };
      // var msg = {
      //   host : "mail.bwbalkans.al",
      //   port : "26",
      //   interval: 5,
      //   type : "smtp_check"
      // };

      //console.log(msg);
      var ok = ch.assertQueue(q, {durable: false});
      
      return ok.then(function(_qok) {
        //ch.sendToQueue(q, new Buffer(JSON.stringify(jobToDo)));
        ch.sendToQueue(q, new Buffer(JSON.stringify(msg)));
        console.log(" [x] Sent job to rabbitMQ");
        //console.log(msg);
        return ch.close();
      });
    })).ensure(function() { conn.close(); });;
  }).then(null, console.warn);
}


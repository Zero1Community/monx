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

Service.find({running_status : true}, function(err, services) {
    if(configs.debug) console.log(services);
    scheduler(services);
    mongoose.connection.close();
});

// TODO: nqs caktivizohet ne DB si do updatohet ktu
// duhet shtu nji funksion me tick 30 sekonda qe shef sherbimet qe jane caktivizu dhe i ben clearInterval ktyre te startuarave

function scheduler(taskList){
  //TODO to start when is pulled for the first time
  if(configs.debug) console.log('Got service from DB', taskList);
  taskList.forEach(function(task){
   // kjo zgjidhet kshu po duhet gjet nej mekanizem anti-bukosje
   // nej queue lineare psh , boh..
   // workEmmiter(task);
// 
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


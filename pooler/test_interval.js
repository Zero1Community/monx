#!/usr/bin/env node

var when = require('when');
var amqp = require('amqplib');
var configs = require('../config/configs.js');

var mongoose = require('mongoose');
var User = require('../models/user.js');
var dbConfig = require('../config/db.js');
var Service = require('../models/service.js');

var intervals = [];
// kjo duhet bo me .then()

var total_services = [];

function DbUpdateServices () {
    mongoose.connect(dbConfig.url);
    Service.find({running_status : true}, function(err, services) {
        //if(configs.debug) console.log(services);
        total_services = services;
        mongoose.connection.close();
    });



mongoose.connect(dbConfig.url);
console.log('Duke marre nga DB');
Service.find({running_status : true}, function(err, services) {
    //if(configs.debug) console.log(services);
    scheduler(services);
    mongoose.connection.close();
});


// TODO: nqs caktivizohet ne DB si do updatohet ktu
// duhet shtu nji funksion me tick 30 sekonda qe shef sherbimet qe jane caktivizu dhe i ben clearInterval ktyre te startuarave


//     setInterval(function(task) {
//           //let's emmit the work on RabbitMQ
//           workEmmiter(task);
//           if(configs.debug) console.log(task);
//     }, task.interval*30000, task);
// }


function scheduler(taskList){
  //TODO to start when is pulled for the first time
  //if(configs.debug) console.log('Got service from DB', taskList);
  console.log('Hyme ne scheduler');
  taskList.forEach(function(task){
   // kjo zgjidhet kshu po duhet gjet nej mekanizem anti-bukosje
   // nej queue lineare psh , boh..
   // workEmmiter(task);
// 
  console.log('Creating interval with ID ' + task._id);
  intervals[task._id] = setInterval(function(task) {
          //let's emmit the work on RabbitMQ
          console.log('Po monitorojme '+ task.name);
          //workEmmiter(task);
          //if(configs.debug) console.log(task);
    }, task.interval*1000, task);
//  console.log('mbaroi foreach');
  });
//  console.log('mbaroi funksioni');
}

//console.log('dylem nga funksioni');
var test3 = 0;

var controller = setInterval(function() {
          //let's emmit the work on RabbitMQ
          test3 += 1;
          console.log('Po kontrollojme');
          if(test3 == 8){
            clearInterval(intervals['55c68ba3f90c636a6ffc444d']);
            DbUpdateServices(function () {
              intervals['55c68ba3f90c636a6ffc444d'] = 
            });
          }
          //workEmmiter(task);
          //if(configs.debug) console.log(task);
}, 5000);


// intervals.forEach(function(inter){
//       console.log(inter);
// });

// function workEmmiter(jobToDo){

//   amqp.connect('amqp://localhost').then(function(conn) {
//     return when(conn.createChannel().then(function(ch) {

//       var q = 'all_checks';
//       var ok = ch.assertQueue(q, {durable: false});

//       return ok.then(function(_qok) {
//         ch.sendToQueue(q, new Buffer(JSON.stringify(jobToDo)));
//         if(configs.debug) console.log(" [x] Sent job to rabbitMQ");
//         return ch.close();
//       });
//     })).ensure(function() { conn.close(); });;
//   }).then(null, console.warn);

// }


var mongoose = require('mongoose');
var User     = require('../models/user.js');
var Service  = require('../models/service.js');
var _        = require('underscore');

var async = require('async');
var logger  = require('../modules/logger.js');
var workEmmiter = require('../modules/emmiter.js');

var configs = require('../config/configs.js');
var schedule = require('node-schedule');
var when    = require('when');
var amqp    = require('amqplib');
var j = schedule;


//console.log(j.scheduledJobs);
//j.cancelJob('jari');

function DbUpdateServices () {

  mongoose.connect(configs.mongodb.url);
  logger('info','Duke marre nga DB');

  Service.find({running_status : true}, function(err, services) {
    //TODO: po kur nuk gje gjo ?
    //logger('debug',services);
    services.forEach(function(task){
      console.log(task.name);
      j.scheduleJob("*/3 * * * *", function(err){
          //console.log(task.name);
          workEmmiter(task,'service_checks');
      }); 
    });
    mongoose.connection.close();
  });
}


DbUpdateServices();
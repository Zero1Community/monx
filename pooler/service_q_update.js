var when = require('when');
var amqp = require('amqplib');
var configs = require('../config/configs.js');

var workEmmiter = require('../modules/emmiter.js');

var mongoose = require('mongoose');
var User = require('../models/user.js');
var dbConfig = require('../config/db.js');
var Service = require('../models/service.js');


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

workEmmiter(task,'service_updates');
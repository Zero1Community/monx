var when        = require('when');
var amqp        = require('amqplib');
var configs     = require('../config/configs.js');

var workEmmiter = require('../modules/emmiter.js');

var mongoose    = require('mongoose');
var User        = require('../models/user.js');
//var dbConfig    = require('../config/db.js');
var Service     = require('../models/service.js');


task = {
  _id: '568d3f65645a418130f08b21',
  user: '55662ee347848748120601b4',
  running_status: true,
  interval: 30,
  type: 'http_status',
  url: 'http://monx.me',
  name: 'duapune',
  status: 'ERROR',
  notification_status: {mute: true}
};


workEmmiter(task, 'all_checks');

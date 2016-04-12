var configs = require('../config/configs.js');
var amqp    = require('amqplib');
var checkHttpStatus = require('../modules/checkHttpStatus.js');
var workEmmiter  = require('../modules/emmiter.js');
var request = require('request');
var http = require('http');
var logger  = require('../modules/logger.js');
var async = require('async');
var _ = require('lodash');

//var logger  = require('../modules/logger.js')('workProcessor', configs.logs.processor);
//var checkRBL = require('../modules/checkBlacklist.js');
//var checkPing = require('../modules/checkPing.js');

//just a bunch of functions..

function postToAPI (data) {
  //TODO https if
  return;
  logger('info', 'Posting data to API');
  logger('debug', data);
  //if(configs.debug) console.log('Data received', data);
  var options = {
    uri: configs.api_url + 'service-data/add',
    //headers: { 'Content-Type': 'application/json', },
    method: 'POST',
    agent: new http.Agent({keepAlive:false}),
    json: {
      data : {
        message: data.message,
        status: data.status,
        service_id: data.service_id,
        user: data.user,
        status_code: data.status_code,
        name: data.name
      }
    }
  };
  if(data.dump != null){
    logger('debug', 'Adding content to API Call');
    options.json.data.content = data.dump;
  }
  else{
    logger('debug', 'No HTML error content added to API call ');
  }

  request(options, function(error, response, body){
    if(error) {
      logger('error','Got error while posting data to API !');
      logger('error',error);
    } else {
      logger('info','Data posted to API!');
      logger('debug',response.statusCode);
    }
  });
}


// actual work done 

var tasksQueue = async.queue(function (tC, callback) {
    console.log(tC);
    console.log('Performing task: ' + tC._id);
    console.log('----------------------------------');
    console.log('Waiting to be processed: ', tasksQueue.length());
    logger('info','Got type: ' + tC.type);

    if(tC.type === "blacklist"){
      //monxBlacklist(tC);
    }
    else if(tC.type === "http_status"){
      checkHttpStatus(tC, 8000, function (data) {
        console.log(data);
        callback(data);
        //data['service_id'] = tC._id;
      });
    }
    else if(tC.type === "icmp_ping"){
      //monxPing(tC);
    }
    else if(tC.type === "api_route_check"){
      // kontrollo 3-4 URL ne grup te nje API
    }
    else if(tC.type === "api_response_time"){
      //monxPing(tC);
    }
    else{
      console.log(tC);
      console.log('got weird data');
      callback('bohh');      
    }
    // setTimeout(function() {
    //   callback('Task went longer than the timeout..');
    // }, 60000);
// throttle aka task concurrency , e vej
}, 50);


function GetWorkToDo() {
  amqp.connect(configs.rabbitmq.url).then(function(conn) {
    process.once('SIGINT', function() { conn.close(); });
    return conn.createChannel().then(function(ch) {

      var ok = ch.assertQueue('service_checks', {durable: false});
      // todo : error catching per kur nuk lidhet queueja
      ok = ok.then(function(_qok) {
        return ch.consume('service_checks', function(msg) {
        //return ch.consume('all_checks', function(msg) {
          logger('info',' [x] Received a task');
          var toCheck = JSON.parse(msg.content.toString());
          //if(configs.debug) console.log(toCheck);
          logger('debug',toCheck);
          //processWork(toCheck);
          tasksQueue.push(toCheck, function(err) {
            //ktu ka mbaru tasku
            if (err) {
              console.log(err);
            }
            return;
          });
        }, {noAck: true});
      });

      return ok.then(function(_consumeOk) {
        logger('info',' [*] Waiting for messages. To exit press CTRL+C');
      });
    });
  }).then(null, logger('info',console.warn)).catch(function (err) {
    logger('error', err);
    process.exit(1);
  });
}


// When all is processed, drain is called (ky osht event si me thon xD)
tasksQueue.drain = function() {
    console.log('All items have been processed.');
};

// tasksQueue.unshift({name: 'Most important task'}, function(err) {
//     //Done
//     if (err) {
//       console.log(err);
//     }
//   });

GetWorkToDo();

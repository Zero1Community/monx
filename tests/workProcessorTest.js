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

// just a bunch of functions..

function postToAPI (data) {
  //TODO https if
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


// http status module
function monxHttpStatus(httpStatObject){
  // TODO replace 8000 with httpStatObject.timeout
  checkHttpStatus(httpStatObject, 8000, function (data) {
    // duhet fut timeout si parameter jareby
    //double check here
    //TODO: duhet ripare llogjika e ksaj ndoshta duhet me .then 
    // if(data.status === 'ERROR'){
    //   checkHttpStatus(httpStatObject, 8000, function (rechecked_data) {
    //     console.log('PO RIKONTROLLOHET'); // me logger kjo kur ta tarosh
    //     rechecked_data['service_id'] = httpStatObject._id;
    //     rechecked_data['name'] = httpStatObject.name;
        
    //     console.log('CURRENT RECHECKER DATA'); // me logger kjo kur ta tarosh
    //     console.log(httpStatObject); // me logger kjo kur ta tarosh
        // if(httpStatObject.interval > 60 && rechecked_data.status === 'ERROR'){
        //     httpStatObject.interval = 60;
        //     console.log('UPDATING DATA TO SERVICEEEEEEE')
        //     workEmmiter(httpStatObject,'service_updates');
        // }
        // else if(rechecked_data.status === 'OK' && httpStatObject.interval === 60 && httpStatObject.options.original_interval !== 60){
        //     httpStatObject.interval = httpStatObject.options.original_interval;
        //     workEmmiter(httpStatObject,'service_updates');
        // }
    //     postToAPI(rechecked_data, function (err) {
    //       if (err) {
    //         logger('error', err);
    //       } else {
    //         logger('info', 'Data posted!');
    //       }
    //     }, 3000);
    //   });
    // } else {
      console.log(data);
      data['service_id'] = httpStatObject._id;
      data['name'] = httpStatObject.name;
      postToAPI(data, function (err,cb) {
        if (err) {
          logger('error', err);
          return(cb(err));
        } else {
          logger('info', 'Data posted!');
          return(cb(err));
        }
      }, 3000);
    //}
  });
}


// actual work done 

var tasksQueue = async.queue(function (tC, callback) {
    console.log('Performing task: ' + tC.name);
    console.log('----------------------------------');
    logger('info','Got type: ' + tC.type);
    if(tC.type === "blacklist"){
      //callback(monxBlacklist(tC));
      callback();
    }
    if(tC.type === "http_status"){
      callback(monxHttpStatus(tC));
    }
    if(tC.type === "icmp_ping"){
      //monxPing(tC);
    }
    if(tC.type === "api_route_check"){
      // kontrollo 3-4 URL ne grup te nje API
    }
    if(tC.type === "api_response_time"){
      //monxPing(tC);
    }
    //just in case 
    setTimeout(function() {
      callback('Task went longer than the timeout..');
    }, 10000);
// throttle aka task concurrency 
}, 1);


function GetWorkToDo() {
  amqp.connect(configs.rabbitmq.url).then(function(conn) {
    process.once('SIGINT', function() { conn.close(); });
    return conn.createChannel().then(function(ch) {

      var ok = ch.assertQueue('all_checks', {durable: false});
      // todo : error catching per kur nuk lidhet queueja
      ok = ok.then(function(_qok) {
        return ch.consume('all_checks', function(msg) {
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

// _.each(tasksList, function(task) {
//   tasksQueue.push({name: task}, function(err) {
//     //Done
//     if (err) {
//       console.log(err);
//     }

//   });
// });

//Puts a tasks in front of the queue
// tasksQueue.unshift({name: 'Most important task'}, function(err) {
//     //Done
//     if (err) {
//       console.log(err);
//     }
//   });

GetWorkToDo();

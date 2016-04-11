var configs = require('../config/configs.js');
var schedule = require('node-schedule');
var when    = require('when');
var amqp    = require('amqplib');
var j = schedule;
 

//console.log(j.scheduledJobs);
//j.cancelJob('jari');

var tasksQueue = async.queue(function (tC, callback) {
    console.log(tC);
    console.log('Emmiting task: ' + tC._id);
    console.log('----------------------------------');
    console.log('Waiting to be processed: ', tasksQueue.length());
    logger('info','Got type: ' + tC.type);

    
    j.scheduleJob(tC._id,"*/1 * * * *", function(){
        amqp.connect(configs.rabbitmq.url).then(function(conn) {
          return when(conn.createChannel().then(function(ch) {

            var q = queue;
            var ok = ch.assertQueue(q, {durable: false});

            return ok.then(function(_qok) {
              ch.sendToQueue(q, new Buffer(JSON.stringify(tC)));
              logger('info',' [x] Sent job to rabbitMQ queue '+ queue );
              return ch.close();
            });
          })).ensure(function() { conn.close(); });
          //TODO error handle + ca eshte kjo consoli ktu ?
        }).then(callback('Emmited task'));
      }); 
    }
    // setTimeout(function() {
    //   callback('Task went longer than the timeout..');
    // }, 60000);
// throttle aka task concurrency , e vej
}, 15);


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


GetWorkToDo();


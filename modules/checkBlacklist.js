var dns      = require('native-dns');
var async    = require('async');
var configs  = require('../config/configs.js');
var logger   = require('../modules/logger.js')('blacklist', configs.logs.blacklist);
var redis    = require('redis');

function checkDNS(rbl_server, ip, callback, timeout){

  var result;

  //default timeout
  timeout =  typeof timeout === 'undefined' ? 2000 : timeout; 

  var start = Date.now();
    var delta = Date.now();
    var req = dns.Request({
    question: dns.Question({name: ip.split('.').reverse().join('.') + "." + rbl_server, type: 'A'}),
    //server: { address: '208.67.222.222', port: 53, type: 'udp' },
    server: { address: '127.0.0.1', port: 53, type: 'udp' },
    timeout: timeout
  });

  req.on('timeout', function () {
    var delta = (Date.now()) - start;
    result = {server: rbl_server, status : 2, res_time : delta};
  });

  req.on('message', function (err, answer) {
        //console.log(answer);
    if(answer.answer.length < 1){
        delta = (Date.now()) - start;
        result = {server: rbl_server, status : 0, res_time : delta};
    }
    else{
        delta = (Date.now()) - start;
        result = {server: rbl_server, status : 1, res_time : delta};
      }
  });

  req.on('end', function () {
    callback(result);
  });

  req.send();
}


function checkRBL(host, timeout, callback) {

  var results = [];

    getAndCacheServers(function(err, servers){
        if(err) {
            logger('error',err);
        } else {
            validateAndResolve(host, function(ip){
                async.each(servers, function(server, callback){
                  checkDNS(server, ip, function(result){
                    results.push(result);
                    callback();
                  }, timeout);
                }, function(err) {
                    if(err){
                        console.log(err);
                    }
                  return callback(results);
                });
            });
        }
    });
}

function validateAndResolve(host, callback) {

  if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(host))  
  {  
    return callback(host);
  }  

  dns.resolve4(host, function(error, addr) {
    if(error) {
        //TODO: sikur sbo return kjo kur ka error
      logger('error','Error resolving', error);
    } else {
      // TODO : po kto qe kane shume IP ?
      return callback(addr[0]);
    }
  });

}

function getServersFromDB(callback) {
    
    var MongoClient = require('mongodb').MongoClient;

    MongoClient.connect(configs.mongodb.url, function (err, db) {
      if (err) {
        logger('error','Unable to connect to the mongoDB server.', err);
        return callback(err);
      } else {

        var collection = db.collection('rbl_servers');
        collection.find({}).toArray(function (err, result) {
               if (err) {
                logger('error',err);
                return callback(err);
            } else if (result.length) {
                logger('info','Result from Mongo ', result[0].servers);
            } else {
                logger('info','No result from Mongo');
            }
            db.close();
            return callback(null, result[0].servers);
        });
      }
    });
}

function getAndCacheServers(callback) {
    var client = '';
  if(typeof configs.redis !== 'undefined') {
    client = redis.createClient(configs.redis.url);
  } else {
    client = redis.createClient();
  }

  //redis.debug_mode = configs.debug;

    client.on('error', function (err) {
        logger('error','Unable to connect to the Redis server.', err);
        client.end();
        getServersFromDB(function(err, result){
            return callback(err, result);
        });
    });

    client.on('ready', function(){
        client.get('rbl_servers', function(err, result) {
            if(err) logger('error','Redis get error', err);
            logger('info','Got data from redis ');
            if(result == null) {
              logger('info','Got null from redis, falling back to DB ');
              getServersFromDB(function(err, result){
                logger('info','Writing this to Redis');
                //if(configs.debug) logger.debug("Writing this to Redis", result);
                client.set('rbl_servers', JSON.stringify(result), redis.print);
                client.end();
              });
            } else {
                //if(configs.debug) logger.debug("Result from Redis ", result);
                client.end();
                return callback(null, JSON.parse(result));
            }
        });
    });
}

module.exports = checkRBL;
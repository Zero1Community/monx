var dns      = require('native-dns');
var async    = require('async');
var dbConfig = require('../config/db.js');
var configs  = require('../config/configs.js');
var logger   = require('./logger.js');
var redis = require('redis');

function checkDNS(rbl_server, ip, callback, timeout){

  var result;

  //default timeout
  timeout =  typeof timeout === 'undefined' ? 2000 : timeout; 

  var start = Date.now();
  var req = dns.Request({
    question: dns.Question({name: ip.split('.').reverse().join('.') + "." + rbl_server, type: 'A'}),
    //server: { address: '208.67.222.222', port: 53, type: 'udp' },
    server: { address: '127.0.0.1', port: 53, type: 'udp' },
    timeout: timeout,
  });

  req.on('timeout', function () {
    var delta = (Date.now()) - start;
    result = {server: rbl_server, status : 2, res_time : delta};
  });

  req.on('message', function (err, answer) {
    if(answer.answer.length < 1){
        var delta = (Date.now()) - start;
        result = {server: rbl_server, status : 0, res_time : delta};
    }
    else{
        var delta = (Date.now()) - start;
        result = {server: rbl_server, status : 1, res_time : delta};
      };
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
            if(configs.debug) logger.debug(err);
        } else {
            validateAndResolve(host, function(ip){
                async.each(servers, function(server, callback){
                  checkDNS(server, ip, function(result){
                    results.push(result);
                    callback();
                  }, timeout);
                }, function(err) {
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
      logger.debug('Error resolving', error);
    } else {
      // TODO : po kto qe kane shume IP ?
      return callback(addr[0]);
    }
  });

}

function getServersFromDB(callback) {
    
    var MongoClient = require('mongodb').MongoClient;

    MongoClient.connect(dbConfig.url, function (err, db) {
      if (err) {
        if(configs.debug) logger.debug('Unable to connect to the mongoDB server.', err);
        return callback(err);
      } else {

        var collection = db.collection('rbl_servers');
        collection.find({}).toArray(function (err, result) {
               if (err) {
                if(configs.debug) logger.debug(err);
                return callback(err);
            } else if (result.length) {
                if(configs.debug) logger.debug("Result from Mongo ", result[0].servers);
            } else {
                if(configs.debug) logger.debug("No result from Mongo");
            }
            db.close();
            return callback(null, result[0].servers);
        });
      }
    });
}

function getAndCacheServers(callback) {

  var client = redis.createClient();
  //redis.debug_mode = configs.debug;


    client.on("error", function (err) {
        if(configs.debug) logger.debug('Unable to connect to the Redis server.', err);
        client.end();
        getServersFromDB(function(err, result){
            return callback(err, result);
        });
    });

    client.on('ready', function(){
        client.get('rbl_servers', function(err, result) {
            if(err) logger.debug("Redis get error", err);
            if(configs.debug) logger.debug("Got data from redis ");
            if(result == null) {
              if(configs.debug) logger.debug("Got null from redis, falling back to DB ");
              getServersFromDB(function(err, result){
                if(configs.debug) logger.debug("Writing this to Redis");
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
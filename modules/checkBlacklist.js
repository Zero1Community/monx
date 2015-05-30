var dns = require('native-dns');
var async = require('async');
var dbConfig = require('../config/db.js');
var configs = require('../config/configs.js');

function checkDNS(rbl_server, ip, callback, timeout){

  var result;

  //default timeout
  timeout =  typeof timeout === 'undefined' ? 2000 : timeout; 

  var start = Date.now();
  var req = dns.Request({
    question: dns.Question({name: ip.split('.').reverse().join('.') + "." + rbl_server, type: 'A'}),
    server: { address: '208.67.222.222', port: 53, type: 'udp' },
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


function checkRBL(host, callback) {

  var results = [];

    getAndCacheServers(function(err, servers){
        if(err) {
            if(configs.debug) console.log(err);
        } else {
            validateAndResolve(host, function(ip){
                async.each(servers, function(server, callback){
                  checkDNS(server, ip, function(result){
                    results.push(result);
                    callback();
                  });
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
      if(error) console.log('Error resolving', err);
    } else {
      return callback(addr[0]);
    }
  });

}

function getServersFromDB(callback) {
    
    var MongoClient = require('mongodb').MongoClient;

    MongoClient.connect(dbConfig.url, function (err, db) {
      if (err) {
        if(configs.debug) console.log('Unable to connect to the mongoDB server.', err);
        return callback(err);
      } else {

        var collection = db.collection('rbl_servers');
        collection.find({}).toArray(function (err, result) {
               if (err) {
                if(configs.debug) console.log(err);
                return callback(err);
            } else if (result.length) {
                if(configs.debug) console.log("Result from Mongo ", result[0].servers);
            } else {
                if(configs.debug) console.log("No result from Mongo");
            }
            db.close();
            return callback(null, result[0].servers);
        });
      }
    });
}

function getAndCacheServers(callback) {

  var redis = require("redis");
  var client = redis.createClient();
  redis.debug_mode = configs.debug;


    client.on("error", function (err) {
        if(configs.debug) console.log('Unable to connect to the Redis server.', err);
        client.end();
        getServersFromDB(function(err, result){
            return callback(err, result);
        });
    });

    client.on('ready', function(){
        client.get('rbl_serverssa', function(err, result) {
            if(configs.debug) console.log("Redis get error", err);
            if(configs.debug) console.log("Redis get result", result);
            if(result == null) {
                getServersFromDB(function(err, result){
                    if(configs.debug) console.log("Po shkruajme ne redis", result);
                    client.set('rbl_serverssa', JSON.stringify(result), redis.print);
                    client.end();
                });
            } else {
                if(configs.debug) console.log("Result from Redis ", result);
                client.end();
                return callback(null, JSON.parse(result));
            }
        });
    });
}

module.exports = checkRBL;
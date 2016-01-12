var configs  = require('../config/configs.js');
var logger   = require('../modules/logger.js')('smtp', configs.logs.smtp);



net = require('net');

function checkSmtp(host,port,cb) {

    var client = net.connect(port, host, function() {
        logger('debug','CONNECTED TO: ' + host + ':' + port);
        //i can write to a socket anything, still no response
        client.write("EHLO " + host + "\r\n");
        //client.write("OPTIONS\r\n");
    });

    client.on('data', function(data) {
        logger('debug','DATA: ' + data);

        // ktu duhet te bojm ket mbasi kemi marre te dhenat  : client.close();
    });

    client.on('error', function(err) {
        logger('error',err );
    });

    client.on('close', function() {
        logger('debug','Connection closed');
    });
}


checkSmtp('pik.al',26,function(data){

});
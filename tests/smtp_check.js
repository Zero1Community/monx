/**
 * Created by tuwid on 16-01-11.
 */


net = require('net');

function checkSmtp() {

    var options = {
        host: 'mail.bill.it',
        port: 26
    }

    var client = net.connect(options.port, options.host, function() {
        console.log('CONNECTED TO: ' + options.host + ':' + options.port);
        //i can write to a socket anything, still no response
        client.write("EHLO mail.bill.it\r\n");
        //client.write("EHLO mail.bill.it\r\n");
        //client.write('EHLO mail.bill.it');
    });

    client.on('data', function(data) {
        console.log('DATA: ' + data);
    });

    client.on('error', function(err) { console.log(err );})

    client.on('close', function() {
        console.log('Connection closed');
    });
}


checkSmtp();
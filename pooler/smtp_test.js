// smtp_check
function monxSmtp(smtpObject,callback){

var net = require('net');
var client = new net.Socket();

client.connect(smtpObject.port, smtpObject.host, function() {
    console.log('CONNECTED TO: ' + smtpObject.host + ':' + smtpObject.port);
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
    client.write('EHLO ' + smtpObject.host);
});

client.setTimeout(smtpObject.timeout*1000, function(){
		console.log("u kap timeouti me tii");
});

client.on('timeout', function() {
    console.log('Connection timouet');
    // Close the client socket completely
    client.destroy(); 
});

client.on('error', function(err){
    console.log('Error : ' + err);
})

client.on('data', function(data) {
    
    console.log('DATA: ' + data);
    // Close the client socket completely
    client.destroy();
});

// Add a 'close' event handler for the client socket
client.on('close', function() {
    console.log('Connection closed');
});

}

var s_check = {
		host : "mail.zero1.al",
		port : "26",
		interval: 5,
		type : "smtp_check",
		timeout : 2
	};

monxSmtp(s_check);


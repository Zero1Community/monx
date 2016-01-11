/**
 * Created by tuwid on 16-01-11.
 */

var ping = require('net-ping');
var dns = require('native-dns');

// raw sockets issue.. vk duhet sudo
// the ping lib accepts only IPs


function checkPing(host,timeout,cb){
    var session = ping.createSession ({
            timeout: timeout
    });
    validateAndResolve(host,function(error,ip){
        if(error){
            session.close();
            return cb({message: 'DNS Issue / Unable to resolve host', status_code : '-108', status: 'ERROR'});
        }
        else{
            session.pingHost (ip, function (error) {
                if (error){
                    session.close();
                    if (error instanceof ping.RequestTimedOutError){
                        console.log (ip + ": Request Timed Out");
                        cb({message: 'Request Timed Out', status_code : '-101', status: 'ERROR'});
                    }
                    else if (error instanceof ping.DestinationUnreachableError) {
                        console.log(ip + ": Destination Unreachable");
                        cb({message: 'Destination Unreachable', status_code : '-102', status: 'ERROR'});
                    }
                    else if (error instanceof ping.PacketTooBigError){
                        console.log (ip + ": Packet Too Big");
                        cb({message: 'Packet Too Big', status_code : '-103', status: 'ERROR'});
                    }
                    else if (error instanceof ping.ParameterProblemError) {
                        console.log(ip + ": Wrong Parameter");
                        cb({message: 'Wrong Parameter', status_code : '-104', status: 'ERROR'});
                    }
                    else if (error instanceof ping.RedirectReceivedError) {
                        console.log(ip + ": Redirect Received");
                        cb({message: 'Redirect Received', status_code : '-105', status: 'ERROR'});
                    }
                    else if (error instanceof ping.SourceQuenchError) {
                        console.log(ip + ": Source Quench");
                        cb({message: 'Source Quench', status_code : '-106', status: 'ERROR'});
                    }
                    else if (error instanceof ping.TimeExceededError) {
                        console.log(ip + ": TTL Exceeded");
                        cb({message: 'TTL Exceeded', status_code : '-107', status: 'ERROR'});
                    }
                    else {
                        console.log(ip + ": " + 'Unhandled error');
                        console.log(ip + ": " + error.toString());
                        cb({message: 'Unknown Error', status_code : '-109', status: 'ERROR'});
                    }
                }
                else{
                    session.close();
                    console.log (ip  + ": OK");
                    cb({message: 'Request TImed Out', status_code : '-100', status: 'OK'});
                }
            });
        }
    })
}


function validateAndResolve(host, callback) {

    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(host))
    {
        return callback(null,host);
    }

    dns.resolve4(host, function(error, addr) {
        if(error) {
            //TODO: sikur sbo return kjo kur ka error
            //logger('error','Error resolving', error);
            return callback(error);
        } else {
            // TODO : po kto qe kane shume IP ?
            return callback(null,addr[0]);
        }
    });
}


checkPing('8.8.8.9', 2000, function (data) {
    // duhet fut timeout
    console.log(data);
});
/**
 * Created by tuwid on 16-01-11.
 */

var ping = require('net-ping');

var session = ping.createSession ();

// raw sockets issue.. vk

session.pingHost ('8.8.8.8', function (error, target) {
    if (error){
        if (error instanceof ping.RequestTimedOutError){
            console.log (target + ": Request Timed Out");
        }
        else if (error instanceof ping.DestinationUnreachableError) {
            console.log(target + ": Destination Unreached");
        }
        else if (error instanceof ping.PacketTooBigError){
            console.log (target + ": Packet Too Big");
        }
        else if (error instanceof ping.ParameterProblemError) {
            console.log(target + ": Wrong Parameter");
        }
        else if (error instanceof ping.RedirectReceivedError) {
            console.log(target + ": Redirect Received");
        }
        else if (error instanceof ping.SourceQuenchError) {
            console.log(target + ": Source Quench");
        }
        else if (error instanceof ping.TimeExceededError) {
            console.log(target + ": TTL Exceeded");
        }
        else {
            console.log(target + ": " + 'Unhandled error');
            console.log(target + ": " + error.toString());
        }
    }
    else{
        console.log (target + ": OK");
    }
});
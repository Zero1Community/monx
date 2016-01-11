/**
 * Created by tuwid on 16-01-11.
 */

// ksaj i duhet nje timeout
var ping = require('ping-net');
ping.ping({ address: '109.69.2.62', port:88}, function(data) {
    console.log(data);
});

//ping.ping([
//    { address: '127.0.0.1', port:8080},
//    { address: '192.168.2.1', port:8080}
//], function(data) {
//    console.log(data);
//});
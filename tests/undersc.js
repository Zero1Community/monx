var _ = require('underscore');

var a = [{
                "res_time" : 4,
                "status" : 1,
                "server" : "bl.shlink.org"
            }, 
            {
                "res_time" : 5,
                "status" : 1,
                "server" : "lists.dsbl.org"
            }, 
            {
                "res_time" : 4,
                "status" : 1,
                "server" : "dyn.shlink.org"
            }, 
            {
                "res_time" : 5,
                "status" : 1,
                "server" : "tor.ahbl.org"
            }
      ];

var b = [
      ];
var a_emrat = []; 
var b_emrat = []; 
a.forEach(function (element) {
		//console.log(element.server);
		a_emrat.push(element.server);
});
b.forEach(function (element) {
		//console.log(element.server);
		b_emrat.push(element.server);
});


var removed = _.difference(a_emrat,b_emrat);
var added = _.difference(b_emrat,a_emrat);
console.dir("Removed " + removed);
console.dir("Added " + added);



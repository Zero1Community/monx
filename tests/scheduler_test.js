var schedule = require('node-schedule');
 
var j = schedule;

for (var i = 1 ; i <  50; i++) {
  j.scheduleJob("*/" + i + " * * * *", function(){
    console.log("I BASHKUAR");
  });
}

var schedule = require('node-schedule');
 
var intervals = [];

for (var i = 1 ; i < 50; i++) {
  intervals[i] = schedule;
  intervals[i].scheduleJob("*/" + i + " * * * *", function(){
    console.log("INDIVIDUAL ");
  });
}

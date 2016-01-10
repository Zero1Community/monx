var checkRBL = require('../modules/checkBlacklist.js');

checkRBL('31.170.160.66', 80000, function(totalResults){
  console.log('Scan finished for host');
	//if(configs.debug) console.log('Result: ', results);
	var blackStatus = [];
	var timeoutStatus = [];
	var cleanStatus = [];
	var stat = 'OK';
	//The logic for the status to be handled
	for (var i = totalResults.length - 1; i >= 0; i--) {
		// if(totalResults[i]['status'] > 0){
		// 	if(totalResults[i]['status'] == 1){
		// 		stat = 'ERROR';
		// 		blackStatus.push(totalResults[i]);
		// 	}
		// 	if(totalResults[i]['status'] == 2){
		// 		timeoutStatus.push(totalResults[i]);
		// 	}
		// }
		// else{
		// 	cleanStatus.push(totalResults[i]);
		// }
		console.log(totalResults[i]);
	}
});
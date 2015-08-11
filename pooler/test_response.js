function postToAPI (data) {
	var request = require('request');
	console.log("Posting to API");
	//if(configs.debug) console.log('Data received', data);
	var options = {
	  uri: 'http://localhost:3000/service-data/add',
	  //headers: { 'Content-Type': 'application/json', },
	  method: 'POST',
	  json: {
	    data : {
		    message: data.message,
		    status: data.status,
		    service_id: data.service_id,
		    user: data.user
	    }
	  }
	};
	request(options, function(error, response, body){
	  if(error) {
	      console.log('Got error while posting data to API !');
	      console.log(error);
	  } else {
	      console.log('Data posted to API!');
	      console.log(response.statusCode);
		}
	});
}


data = {
	message : 'Test',
	status : 'Test',
	service_id : 'Test',
	user : 'Test',
};

postToAPI(data);
postToAPI(data);
postToAPI(data);
postToAPI(data);
postToAPI(data);
postToAPI(data);
postToAPI(data);
postToAPI(data);
postToAPI(data);
postToAPI(data);
postToAPI(data);
postToAPI(data);
postToAPI(data);
postToAPI(data);
postToAPI(data);
postToAPI(data);
postToAPI(data);
postToAPI(data);
postToAPI(data);
postToAPI(data);
postToAPI(data);
postToAPI(data);
postToAPI(data);
postToAPI(data);
postToAPI(data);
postToAPI(data);
postToAPI(data);
postToAPI(data);
postToAPI(data);
postToAPI(data);
postToAPI(data);
postToAPI(data);
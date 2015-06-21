

function getRblServers(mbaruanTeGjitha){
	//console.log("Start");
	var mongoose = require('mongoose');
		dbConfig = require('../config/db.js');
	//console.log("U lidhem");
	var db = mongoose.connection;

	db.on('error', console.error);
	db.once('open', function() {
		console.log("bejme sikur lidhemi ");
	});

	mongoose.connect(dbConfig.url);

	console.log("Defining schema rblSchema");
	var rblSchema = new mongoose.Schema({
			rbl_servers : [String]
	});
	var rblModel = mongoose.model('rbl_server', rblSchema);


	rblModel.find({} , function(err, rbls) {
		//console.log("Called find function on rblModel schema" + rbls);
		//console.log(rblModel);
		if (err) return console.error(err);
			//console.log(rbls);
			mongoose.connection.close();
			mbaruanTeGjitha(rbls);
	});
	// mos valle duhet te mbyll connecitonin ?
}

getRblServers(function mbarunPra(cevrat){
	console.log(cevrat);
	console.log("mbaroi me ti");
});

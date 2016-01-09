var express     = require('express');
var router      = express.Router();
var middleware  = require('../middlewares/middlewares.js');
var configs     = require('../config/configs.js');
var logger      = require('../modules/logger.js')('api', configs.logs.api);
var checker     = require('../modules/checker.js');
var mongoose    = require('mongoose');
var ServiceData = require('../models/service_data.js');


//function isValidJson(str) {
//    try {
//        JSON.parse(str);
//    } catch (e) {
//        return false;
//    }
//    return true;
//}

function hasKeys(str, keys) {
    keys.forEach(function (el) {
        if (str.hasOwnProperty(el)) {
            console.log('Key ' + el + ' OK');
            if (str[el] == '') {
                logger('warn', 'Key ' + el + 'does not contain data');
            }
        }
        else {
            return false;
        }
    })
    console.log('Keys look ok');
    return true;
}

router.post('/service-data/add', function(req, res){
	//TODO: duhen pare returnet e DNS-ve qe te jene vetem 127-ta , jo IP te cuditshme
	//TODO: paneli i adminit duhet te kete statusin e QUEVE dhe 1 buton qe fshin cachene e redisit
	//to be validated
	// TODO: duhet bo extend ky dhe duhet kaluar me poshte 
	// mbasi eshte gjetur objekti ne menyre qe te fusim edhe EMRIN e sherbimit te subjekti
	var data = req.body.data;
	logger('info',data);

	//data['source'] = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	logger('info','Calling checker');
    //TODO: data integrity check here and aggregation
    //TODO: bej nje funksion integriteti qe i kalon listen e celsave dhe te kthen true ose false
    // our data should look like this:
    //    message: data.message,
    //    status: data.status,
    //    service_id: data.service_id,
    //    user: data.user,
    //    name: data.name
    //logger('info','JSON check successful');

    if (hasKeys(data, ['message', 'status', 'service_id', 'user', 'name'])) {
        logger('info', 'JSON check successful, required keys are in place');

        checker(data, function (err, res) {
            if (err) {
                logger('error', 'Got error in phase 1 on checker ');
                logger('error', err);
            }
            else {
                logger('info', res);
            }
        });
    }
    else {
        // end connection, not a valid json
        logger('error', 'Got invalid json');
    }
	logger('info','Closing the connection');
	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify({'success': 1, error: 0}));
});

module.exports = router;


var express     = require('express');
var router      = express.Router();
var middleware  = require('../middlewares/middlewares.js');
var Service = require('../models/service.js');
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

    if (!data['source']) {
        data['source'] = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    }
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
        //TODO: nej filtrim ktu jarebi
        Service.findById(data.service_id, function (err, service) {
            logger('info', 'Finding the service ');
            if (err) {
                logger('error', 'Error finding the service with id' + data.service_id);
                logger('error', err);
                return err;
            }
            logger('debug', data);
            logger('debug', service);
            data['user'] = service.user;
            data['service_name'] = service.name;
            data['mute_status'] = service.notification_status.mute;

            service.status = data.status;
            service.last_checked = new Date();

            //TODO: nuk e di sa asinkron eshte kjo po duhet te behet asinkron se me sh mundesi vonon
            logger('info', 'Saving the service status and last checked');
            service.save(function (err) {
                if (err) {
                    logger('error', 'There was an error saving the service status', err);
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({'success': 0, error: 1}));
                    //return;
                } else {
                    logger('info', 'The new service status was saved!');
                }
            });
        });

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


var express     = require('express');
var router      = express.Router();

function newRouter( ){

	var args = Array.prototype.slice.call(arguments, 0);
	return router.get(args);

}

module.exports = newRouter;
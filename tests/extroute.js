var express     = require('express');
var Router      = express.Router();
var methods = require('methods');

var PowerRouter = function (path) {

    var pathParam = path;

    if(typeof routeList === 'undefined' || routeList == null) {
      routeList = [];
    }

    methods.concat('all').forEach(function(method){

      Router[method] = function(path){
        var route = Router.route(path);

        if(arguments.length > 2 && typeof arguments[1] === 'string') {

          if(typeof pathParam === 'undefined' || pathParam == null || pathParam == '/') {
            routePath = route.path;
          } else {
            routePath = pathParam + route.path;
          }

          route.name = arguments[1];
          routeList[route.name] = {path: routePath};
          route[method].apply(route, [].slice.call(arguments, 2));
        
          return Router;
        } 

        route[method].apply(route, [].slice.call(arguments, 1));
        return Router;

      };

    });

  return Router;
};
module.exports = PowerRouter;
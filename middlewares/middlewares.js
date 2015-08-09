var Service     = require('../models/service.js');


var middleware = {
    isAuthenticated: function (req, res, next) {
      // if user is authenticated in the session, call the next() to call the next request handler 
      // Passport adds this method to request object. A middleware is allowed to add properties to
      // request and response objects
      if (req.isAuthenticated()) {
        return next();
      } else {
        req.session.after_login_url = req.originalUrl;
        res.redirect('/users/login');
      }
      // if the user is not authenticated then redirect him to the login page
    },
    hasServiceAccess: function (req, res, next) {
      var user_id = req.user.id;
      var service_id = req.params.id;

      if(middleware.isAdmin(req.user)) {
        return next();
      }

      Service.findOne({_id:service_id }, function(err, service) {
        //TODO: Flash Message
        if(err || !service) {
          res.redirect('/dashboard');
        }

        if(service.user == user_id) {
          return next();
        }

        res.redirect('/dashboard');

      });

    },
    isAdmin: function(user) {
      if(user.isAdmin && user.isAdmin === true) {
        return true;
      }
      return false;
    },
    hasAdminAccess: function(req, res, next) {
      var user = req.user;
      if(middleware.isAdmin(user)) {
        return next();
      }
      res.redirect('/dashboard');

    }
}

module.exports = middleware;
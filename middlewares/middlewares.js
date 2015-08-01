var middleware = {
    isAuthenticated: function (req, res, next) {
      // if user is authenticated in the session, call the next() to call the next request handler 
      // Passport adds this method to request object. A middleware is allowed to add properties to
      // request and response objects
      if (req.isAuthenticated())
        return next();
      // if the user is not authenticated then redirect him to the login page
      res.redirect('/users/login');
    },
    hasServiceAccess: function (req, res, next) {
      var user_id = req.user.id;
      var service_id = req.params.id;

      Service.findOne({_id:service_id }, function(err, service) {
        //TODO: Flash Message
        if(err) {
          res.redirect('/dashboard');
        }

        if(service.user_id == user_id) {
          return next();
        }

        res.redirect('/dashboard');

      });

    }
}

module.exports = middleware;
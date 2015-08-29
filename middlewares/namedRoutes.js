var named_routes = {
  add: function(route_name) {
    return function(req, res, next) {
      res.locals.current_route = route_name;
      return next();  
    }
  }
}
module.exports = named_routes;
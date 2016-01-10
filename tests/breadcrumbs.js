var Breadcrumb = {
  routes: null,
  breadcrumb: [],
  init: function(named_routes) {
    this.routes = named_routes;
  },
  register: function(route_name, data) {
    this.routes[route_name].name = data.name;
    this.routes[route_name].parent = data.parent ? data.parent : null;
  },
  show: function(route_name) {
    this.breadcrumb = [];
    this.getParents(route_name);
    //return console.dir(this.breadcrumb);
    return this.breadcrumb;
  },
  getParents: function(route_name) {
    if(this.routes[route_name].parent) {
      this.breadcrumb.unshift([this.routes[route_name].name, this.routes[route_name].path]); 
      return this.getParents(this.routes[route_name].parent);
    }
    return this.breadcrumb.unshift([this.routes[route_name].name, this.routes[route_name].path]); 
  }
};

module.exports = Breadcrumb;
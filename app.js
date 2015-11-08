var express          = require('express');
var expressValidator = require('express-validator');
var nunjucks         = require('nunjucks');
var path             = require('path');
var favicon          = require('serve-favicon');
var cookieParser     = require('cookie-parser');
var bodyParser       = require('body-parser');
var m                = require('./middlewares/middlewares.js');
var paginate         = require('express-paginate');
var moment           = require('moment');
var configs          = require('./config/configs.js');
var logger           = require('./modules/logger.js')('app', configs.logs.app);
var mongoose         = require('mongoose');

mongoose.connect(configs.mongodb.url);


var app = express();


//Templating Engine Config
var env = nunjucks.configure('views', {
    autoescape: true,
    express: app
});

env.addFilter('date', function(date, format) {
    if(arguments.length === 1) {
      //default date format
      return moment(date).format('HH:mm DD/MM/YYYY');
    }
    return moment(date).format(format);
});

//View engine setup
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

//Express Configs
app.use(require('morgan')('combined', { "stream": logger.stream }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator()); // this line must be immediately after express.bodyParser()!
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//Express Session
var expressSession = require('express-session');
app.use(expressSession({
    secret: 'mySecretKey',
    resave: true,
    saveUninitialized: true
}));

//Passport Config
var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

var flash = require('connect-flash');
app.use(flash());

//Flash Messages Middleware
//TODO: Move at Middlewares Dir
app.use(function(req, res, next){
    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages = req.flash('error_messages');
    res.locals.user = req.user;
    next();
});

//Init Passport
var initPassport = require('./auth/init');
initPassport(passport);

//Move user to locals
app.use(function(req, res, next){
  if(req.user) {
    res.locals.user = req.user;
    res.locals.authenticated =! req.user.anonymous;
  }
  next();
});

var users_routes = require('./routes/users')(passport);
var services_routers = require('./routes/services');
var api_routes = require('./routes/api');
var index_routes = require('./routes/index');


app.use(paginate.middleware(5, 5));
app.use('/', index_routes);
app.use('/users', users_routes);
app.use('/services', m.isAuthenticated, services_routers);
app.use('/api', api_routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  logger('error','Got 404');
  logger('error',err);
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

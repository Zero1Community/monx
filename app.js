var express = require('express');
var expressValidator = require('express-validator');
var swig = require('swig');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('./modules/logger.js');


//connect to MongoDB
dbConfig = require('./config/db.js');
var mongoose = require('mongoose');
mongoose.connect(dbConfig.url);

var routes = require('./routes/index');

var app = express();

// view engine setup
app.engine('html', swig.renderFile)
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
//the old logger app.use(logger('dev'));
  
app.use(require('morgan')('combined', { "stream": logger.stream }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator()); // this line must be immediately after express.bodyParser()!
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var passport = require('passport');
var expressSession = require('express-session');


app.use(expressSession({
    secret: 'mySecretKey',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

var flash = require('connect-flash');
app.use(flash());

var initPassport = require('./auth/init');
initPassport(passport);

var users = require('./routes/users')(passport);
var services = require('./routes/services');
var api = require('./routes/api');

app.use(function(req, res, next){
  if(req.user) {
    res.locals.user = req.user;
    res.locals.authenticated = ! req.user.anonymous;
    console.log(res.locals.user);
  }
  next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/services', services);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
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

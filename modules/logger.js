var winston = require('winston');

var customColors = {
  trace: 'white',
  debug: 'green',
  info: 'green',
  warn: 'yellow',
  error: 'red',
  crit: 'red',
  fatal: 'red'
};

var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: './logs/monx.log',
            handleExceptions: true,
            json: true,
            maxsize: 10242880, //5MB
            colorize: false
        }),
        new winston.transports.Console({
          colors: customColors,
          level: 'debug',
          handleExceptions: true,
          json: false,
          colorize: true,
        })
    ],
    exitOnError: false
});


function initLogger(prefix, status){
  if(status) {
    return function(level){
      
      var args = Array.prototype.slice.call(arguments, 1);
      args.push({module:prefix});

      switch(level) {
          case 'info':
              logger.info.apply(null, args);
              break;
          case 'debug':
              logger.debug.apply(null, args);
              break;
          case 'warn':
              logger.warn.apply(null, args);
              break;
          case 'error':
              logger.error.apply(null, args);
              break;
          case 'crit':
              logger.crit.apply(null, args);
              break;
      }
    }
  }
  return function(){ return; };
}


module.exports = logger;
//module.exports = initLogger;

//for express
// module.exports.stream = {
//     write: function(message, encoding){
//         logger.info(message, {module:'app'});
//     }
// };
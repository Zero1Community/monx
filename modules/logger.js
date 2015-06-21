var winston = require('winston');

var customColors = {
  trace: 'white',
  debug: 'green',
  info: 'green',
  warn: 'yellow',
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

module.exports = logger;

//for express
module.exports.stream = {
    write: function(message, encoding){
        logger.info('Express: ', message);
    }
};
var path           = require('path');
var templatesDir   = path.resolve(__dirname, '../views', 'emails');
var emailTemplates = require('email-templates');
var nodemailer     = require('nodemailer');
var async          = require('async');
var configs        = require('../config/configs.js');
//var logger         = require('./logger.js');
var logger = require('../modules/logger.js')('workEmmit', configs.logs.mailer);

var Mailer = {

  sendOne: function(template_name, data, callback) {
    emailTemplates(templatesDir, function(err, template) {

      if (err) {
        logger('error',err);
        return callback(err);
      } else {
        // Prepare nodemailer transport object
        var transport = nodemailer.createTransport({
          service: configs.email.service,
          auth: {
            user: configs.email.auth.user,
            pass: configs.email.auth.pass
          }
        });

        template(template_name, data, function(err, html) {
          if (err) {
            logger('error',err);
            return callback(err);
          } else {
            transport.sendMail({
              from: configs.email.from,
              to: data.email,
              subject: data.subject,
              html: html
              // generateTextFromHTML: true,
            }, function(err, responseStatus) {
              if (err) {
                logger('error',err);
                return callback(err);
              } else {
                logger('info',responseStatus);
                return callback(null, responseStatus);
              }
            });
          }
        });

      }
    });

  },

  sendMany: function(template_name, many_data, callback) {

  	async.each(many_data, function(data, doneCallback){
      Mailer.sendOne(template_name, data, function(err, res){
      	if(err) {
      		logger('error',err);
      		doneCallback();
      		return callback(err);
      	}
  		logger('info',res);
  		doneCallback();
  		return callback(res);
      });
    });

  }
}

module.exports = Mailer;

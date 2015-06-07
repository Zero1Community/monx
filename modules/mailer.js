var path           = require('path');
var templatesDir   = path.resolve(__dirname, '../views', 'emails');
var emailTemplates = require('email-templates');
var nodemailer     = require('nodemailer');
var configs = require('../config/configs.js');

var Mailer = {

  sendOne: function(template_name, data, callback) {
    emailTemplates(templatesDir, function(err, template) {

      if (err) {
        if(configs.debug) console.log(err);
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

        template(template_name, data, function(err, html, text) {
          if (err) {
            if(configs.debug) console.log(err);
            return callback(err);
          } else {
            transport.sendMail({
              from: configs.email.from,
              to: data.email,
              subject: data.subject,
              html: html,
              // generateTextFromHTML: true,
              text: text
            }, function(err, responseStatus) {
              if (err) {
                if(configs.debug) console.log(err);
                return callback(err);
              } else {
                if(configs.debug) console.log(responseStatus);
                return callback(null, responseStatus);
              }
            });
          }
        });

      }
    });

  }
}

module.exports = Mailer;

'use strict';

var nodemailer = require('nodemailer');
var path = require('path');
var templatesDir = path.resolve(__dirname, '..', 'views');
var emailTemplates = require('email-templates');

var EmailAddressRequiredError = new Error('email EmailAddressRequiredErrorss required');

var defaultTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'agli.panci@gmail.com',
        pass: 'oldfswvcuufrpvhh'
    }
});

exports.sendOne = function (email_data, fn) {


var locals = {
  email: 'kot@kot.com',
  subject: 'subkeit',
  kot: 'kot'
};
// make sure that we have an user email
 if (!locals.email) {
   return fn(EmailAddressRequiredError);
 }
 // make sure that we have a message
 if (!locals.subject) {
   return fn(EmailAddressRequiredError);
 }
 emailTemplates(templatesDir, function (err, template) {
   if (err) {
     //console.log(err);
     return fn(err);
   }
   // Send a single email
   template('emails.alert', locals, function (err, html, text) {
     if (err) {
       //console.log(err);
       return fn(err);
     }
     // if we are testing don't send out an email instead return
     // success and the html and txt strings for inspection
     if (process.env.NODE_ENV === 'test') {
       return fn(null, '250 2.0.0 OK 1350452502 s5sm19782310obo.10', html, text);
     }

     var transport = defaultTransport;
     transporter.sendMail(email_data, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Message sent: ' + info.response);
        }
        transporter.close();
      });
   });
 });
}
var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

var notificationsSchema = new mongoose.Schema({
      message: String,
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
      status: String,
      seen: Boolean,
    });

notificationsSchema.plugin(timestamps);

module.exports = mongoose.model('Notification', notificationsSchema);
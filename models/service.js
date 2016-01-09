var mongoose         = require('mongoose');
var ServiceData      = require('./service_data.js');
var mongoosePaginate = require('mongoose-paginate');
var timestamps       = require('mongoose-timestamp');
var logger = require('../modules/logger.js')('checker', configs.logs.model_services);

var serviceSchema = new mongoose.Schema({
      name: String,
      type: String,
      host: String,
      status: String,
      last_checked: Date,
      running_status: Boolean,
      notification_status: {
        mute: { type: Boolean, default: false },
        twitter: { type: Boolean, default: false },
        sms: { type: Boolean, default: false }
      },
      interval: Number,
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },{ strict: false });

serviceSchema.post('save', function (service) {
  var collection = 'service_data_' + service._id;
  mongoose.connection.db.createCollection(collection, function(err, collection) {
      logger('info', collection + " was created!");
  });
});

serviceSchema.plugin(mongoosePaginate);
serviceSchema.plugin(timestamps);

module.exports = mongoose.model('Service', serviceSchema);

var mongoose         = require('mongoose');
var ServiceData      = require('./service_data.js');
var mongoosePaginate = require('mongoose-paginate');
var timestamps       = require('mongoose-timestamp');

var serviceSchema = new mongoose.Schema({
      name: String,
      type: String,
      host: String,
      status: String,
      status_code: {type: String, default: -1},
      last_checked: Date,
      alert_mode: { type: Boolean, default: false }
      running_status: Boolean,
      notification_status: {
        mute: { type: Boolean, default: false },
        twitter: { type: Boolean, default: false },
        sms: { type: Boolean, default: false }
      },
      interval: Number,
      options: {},
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },{ strict: false });

serviceSchema.post('save', function (service) {
  var collection = 'service_data_' + service._id;
  mongoose.connection.db.createCollection(collection, function(err, collection) {
    //console.log(collection + " was created!");
  });
});

serviceSchema.plugin(mongoosePaginate);
serviceSchema.plugin(timestamps);

module.exports = mongoose.model('Service', serviceSchema);

var mongoose = require('mongoose');
var ServiceData = require('./service_data.js');
var mongoosePaginate = require('mongoose-paginate');
var timestamps = require('mongoose-timestamp');

var serviceSchema = new mongoose.Schema({
      name: String,
      type: String,
      host: String,
      status: String,
      running_status: Boolean,
      notification_status: {
        mute: { type: Boolean, default: false }
      },
      interval: Number,
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },{ strict: false });

//TODO: Create a new collection for the service
/*serviceSchema.post('save', function (service) {

});*/

serviceSchema.plugin(mongoosePaginate);
serviceSchema.plugin(timestamps);

module.exports = mongoose.model('Service', serviceSchema);

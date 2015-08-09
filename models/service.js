var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var timestamps = require('mongoose-timestamp');

var serviceSchema = new mongoose.Schema({
      name: String,
      type: String,
      host: String,
      status: String,
      running_status: Boolean,
      notification_status: {
      },
      interval: Number,
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },{ strict: false });

serviceSchema.plugin(mongoosePaginate);
serviceSchema.plugin(timestamps);

module.exports = mongoose.model('Service', serviceSchema);

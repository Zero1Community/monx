var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var serviceSchema = new mongoose.Schema({
      name: String,
      type: String,
      host: String,
      status: String,
      running_status: Boolean,
      notification_status: {
      },
      interval: Number,
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      created_at: { type: Date, required: true, default: Date.now },
      updated_at: { type: Date, required: true, default: Date.now }
    },{ strict: false });

serviceSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Service', serviceSchema);

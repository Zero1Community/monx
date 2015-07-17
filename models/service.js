var mongoose = require('mongoose');

var serviceSchema = new mongoose.Schema({
      name: String,
      type: String,
      host: String,
      enabled: Boolean,
      interval: Number,
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      created_at: { type: Date, required: true, default: Date.now },
      updated_at: { type: Date, required: true, default: Date.now }
    },{ strict: false });

module.exports = mongoose.model('Service', serviceSchema);

var mongoose = require('mongoose');

module.exports = mongoose.model('Service',{
    type: String,
    host: String,
    interval: Number,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});	
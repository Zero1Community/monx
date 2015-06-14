var mongoose = require('mongoose');

module.exports = mongoose.model('Notification',{
    message: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    status: String,
    created_at: { type: Date, required: true, default: Date.now }
});	
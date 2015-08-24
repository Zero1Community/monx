var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var timestamps = require('mongoose-timestamp');
 
var usersSchema = new mongoose.Schema({
    name: String,
    password: String,
    email: String,
    twitter: String,
    phone: String,
    address: String,
    resetPasswordToken: String,
    resetPasswordExpires: Number,
    isAdmin: { type: Boolean, default: false }
});

usersSchema.plugin(mongoosePaginate);
usersSchema.plugin(timestamps);

module.exports = mongoose.model('User', usersSchema);
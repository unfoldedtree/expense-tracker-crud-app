const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    googleId: String,
    roles: [String]
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
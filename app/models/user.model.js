const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    googleId: String,
    email: String,
    name: Object,
    roles: [String]
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
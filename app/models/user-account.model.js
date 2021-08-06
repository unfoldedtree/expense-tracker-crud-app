const mongoose = require('mongoose')

const Account = require('../models/account.model.js');

const UserAccountSchema = mongoose.Schema({
    userId: String,
    accounts: [Account.schema]
}, {
    timestamps: true
});

module.exports = mongoose.model('UserAccount', UserAccountSchema);
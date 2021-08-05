const mongoose = require('mongoose')

const Expense = require('../models/expense.model.js');

const AccountSchema = mongoose.Schema({
    title: String,
    description: String,
    transactions: [Expense.schema]
}, {
    timestamps: true
});

module.exports = mongoose.model('Account', AccountSchema);
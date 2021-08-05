const mongoose = require('mongoose');

const ExpenseSchema = mongoose.Schema({
    text: String,
    amount: Number
}, {
    timestamps: true
});

module.exports = mongoose.model('Expense', ExpenseSchema);
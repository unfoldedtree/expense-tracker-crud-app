const Expense = require('../models/expense.model.js');
const Account = require('../models/account.model.js');

// Create and Save a new Expense
exports.create = (req, res) => {

    Account.findById(req.body.account_id)
        .then(account => {
            // Create a expense
            const expense = new Expense({
                text: req.body.text || "No Description",
                amount: req.body.amount
            });

            account.transactions.push(expense)

            // expense.save()
            account.save()
            .then(account => {
            const data = {
                expense: expense,
                message: "Created expense successfully!"
            }
            res.send(data);
            // res.redirect('/')
            }).catch(err => {
                res.status(500).send({
                message: err.message || "Some error occurred while creating the expense."
            });
        });
        })
        .catch(err => {
            res.status(500).send({
            message: err.message || "Some error occurred while creating the expense."
        });
        });
};

// Retrieve and return all expenses from the database.
exports.findAll = (req, res) => {
    Expense.find()
    .then(expenses => {
        res.send(expenses);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving expenses."
        });
    });
};

// Find a single expense with a expenseId
exports.findOne = (req, res) => {
    Expenses.findById(req.params.expenseId)
    .then(expense => {
        if(!expense) {
            return res.status(404).send({
                message: "Expense not found with id " + req.params.expenseId
            });            
        }
        res.send(expense);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Expense not found with id " + req.params.expenseId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving expense with id " + req.params.expenseId
        });
    });
};

// Update a expense identified by the expenseId in the request
exports.update = (req, res) => {
    // Validate Request
    // if(!req.body.content) {
    //     return res.status(400).send({
    //         message: "Note content can not be empty"
    //     });
    // }

    // Find note and update it with the request body
    Expense.findByIdAndUpdate(req.params.expenseId, {
        text: req.body.text,
        amount: req.body.amount
    }, {new: true})
    .then(expense => {
        if(!expense) {
            return res.status(404).send({
                message: "Expense not found with id " + req.params.expenseId
            });
        }
        // res.send(note);
        const data = {
            expense: expense,
            message: "Updated expense successfully!"
        }
        res.send(data);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Expense not found with id " + req.params.expenseId
            });                
        }
        return res.status(500).send({
            message: "Error updating expense with id " + req.params.expenseId
        });
    });
};

// Delete a expense with the specified expenseId in the request
exports.delete = (req, res) => {

    Account.findById(req.params.accountId)
        .then(account => {
            account.transactions.remove(req.params.expenseId)
            account.save()
                .then(expense => {
                    if(!expense) {
                        return res.status(404).send({
                            message: "Expense not found with id " + req.params.expenseId
                        });
                    }
                    res.send({message: "Expense deleted successfully!"});
                }).catch(err => {
                    if(err.kind === 'ObjectId' || err.name === 'NotFound') {
                        return res.status(404).send({
                        message: "Expense not found with id " + req.params.expenseId
                    });                
                    }
                    return res.status(500).send({
                        message: "Could not delete expense with id " + req.params.expenseId
                    })
                })
        })

    // Expense.findByIdAndRemove(req.params.expenseId)
    // .then(expense => {
    //     if(!expense) {
    //         return res.status(404).send({
    //             message: "Expense not found with id " + req.params.expenseId
    //         });
    //     }
    //     res.send({message: "Expense deleted successfully!"});
    // }).catch(err => {
    //     if(err.kind === 'ObjectId' || err.name === 'NotFound') {
    //         return res.status(404).send({
    //             message: "Expense not found with id " + req.params.expenseId
    //         });                
    //     }
    //     return res.status(500).send({
    //         message: "Could not delete expense with id " + req.params.expenseId
    //     });
    // });
};
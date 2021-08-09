const Expense = require('../models/expense.model.js');
const Account = require('../models/account.model.js');
const UserAccount = require("../models/user-account.model.js");

// Create and Save a new Expense
exports.create = (req, res) => {

    UserAccount.findOne({ userId: { $eq: req.user._id } })
    .then(userAccount => {
        const account = userAccount.accounts.id(req.body.account_id)

            // Create a expense
            const expense = new Expense({
                text: req.body.text || "No Description",
                amount: req.body.amount
            });

            account.transactions.push(expense)
            userAccount.save()
            .then(account => {
            const data = {
                expense: expense,
                message: "Created expense successfully!"
            }
            res.send(data);
            })
            .catch(err => {
                res.statusStatus(500).send({
                message: err.message || "Some error occurred while creating the expense."
            });
        });
    })
    .catch(err => {
        res.sendStatus(500).send({
            message: err.message || "Some error occurred while finding that user."
        })
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

    // Find account and update an expense with the request body
    Account.findById(req.body.account_id)
        .then(account => {
            // Creat a new expense
            // const expense = new Expense ({
            //     text: req.body.text,
            //     amount: req.body.amount
            // })

            let expense = account.transactions.id(req.params.expenseId);
            expense.text = req.body.text;
            expense.amount = req.body.amount;
            // expense.save()
            account.save()
                .then(account => {
                    const data = ({
                        expense: expense,
                        message: "Expense updated successfully!"
                    })
                    res.send(data)
                })
                .catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while updating the expense."
                    })
                })
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while updating the expense."
            })
        })
    // Expense.findByIdAndUpdate(req.params.expenseId, {
    //     text: req.body.text,
    //     amount: req.body.amount
    // }, {new: true})
    // .then(expense => {
    //     if(!expense) {
    //         return res.status(404).send({
    //             message: "Expense not found with id " + req.params.expenseId
    //         });
    //     }
    //     // res.send(note);
    //     const data = {
    //         expense: expense,
    //         message: "Updated expense successfully!"
    //     }
    //     res.send(data);
    // }).catch(err => {
    //     if(err.kind === 'ObjectId') {
    //         return res.status(404).send({
    //             message: "Expense not found with id " + req.params.expenseId
    //         });                
    //     }
    //     return res.status(500).send({
    //         message: "Error updating expense with id " + req.params.expenseId
    //     });
    // });
};

// Delete a expense with the specified expenseId in the request
exports.delete = (req, res) => {

    UserAccount.findOne({ userId: { $eq: req.user._id } })
    .then(userAccount => {
        const account = userAccount.accounts.id(req.params.accountId)
        account.transactions.remove(req.params.expenseId)
        userAccount.save()
        .then(userAccount => {
            // if(!expense) {
            //     return res.status(404).send({
            //         message: "Expense not found with id " + req.params.expenseId
            //     });
            // }
            res.send({message: "Expense deleted successfully!"});
        })
        .catch(err => {
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
    .catch(err => {
        return res.status(500).send({
            message: err.message || "Some error occurred while finding that user."
        })
    });


    // Account.findById(req.params.accountId)
    //     .then(account => {
    //         account.transactions.remove(req.params.expenseId)
    //         account.save()
    //             .then(expense => {
    //                 if(!expense) {
    //                     return res.status(404).send({
    //                         message: "Expense not found with id " + req.params.expenseId
    //                     });
    //                 }
    //                 res.send({message: "Expense deleted successfully!"});
    //             }).catch(err => {
    //                 if(err.kind === 'ObjectId' || err.name === 'NotFound') {
    //                     return res.status(404).send({
    //                     message: "Expense not found with id " + req.params.expenseId
    //                 });                
    //                 }
    //                 return res.status(500).send({
    //                     message: "Could not delete expense with id " + req.params.expenseId
    //                 })
    //             })
    //     })

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
const Account = require('../models/account.model.js');
const UserAccount = require("../models/user-account.model.js");

// Create and Save a new account
exports.create = (req, res) => {

    // Create a account
    const account = new Account({
        title: req.body.title || "Untitled Account", 
        description: req.body.description || "No Description"
    });

    // Save account in the database
    UserAccount.findOne({ userId: { $eq: req.user._id } })
    .then(userAccount => {
        userAccount.accounts.push(account)
        userAccount.save()
        .then(new_account => {
            const data = {
                account: account,
                message: "Created account successfully!"
            }
        res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the account."
        });
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving user accounts."
        });
    });
};

// Retrieve and return all accounts from the database.
exports.findAll = (req, res) => {
    UserAccount.findOne({ userId: { $eq: req.user._id } })
        .then(userAccount => res.send(userAccount.accounts))
        .catch(err => {
            console.log(err)
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving user accounts."
            });
        });
};

// Find a single account with a accountId
exports.findOne = (req, res) => {

    UserAccount.findOne({ userId: { $eq: req.user._id } })
    .then(userAccount => {
        let account = userAccount.accounts.id(req.params.accountId)
        if(!account) {
            return res.status(404).send({
                message: "Account not found with id " + req.params.accountId
            }); 
        } else {
            res.send(account);
        }
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Account not found with id" + req.params.accountId
            })
        }
        return res.status(500).send({
            message: "Error retrieving account with id" + req.params.accountId
        })
    });

    // Account.findById(req.params.accountId)
    // .then(account => {
    //     if(!account) {
    //         return res.status(404).send({
    //             message: "Account not found with id " + req.params.accountId
    //         });            
    //     }
    //     res.send(account);
    // }).catch(err => {
    //     if(err.kind === 'ObjectId') {
    //         return res.status(404).send({
    //             message: "Account not found with id " + req.params.accountId
    //         });                
    //     }
    //     return res.status(500).send({
    //         message: "Error retrieving account with id " + req.params.accountId
    //     });
    // });
};

// Update a account identified by the accountId in the request
exports.update = (req, res) => {

    // Find account and update it with the request body
    UserAccount.findOne({ userId: { $eq: req.user._id } })
    .then(userAccount => {
        let account = userAccount.accounts.id(req.params.accountId)
        account.title = req.body.title;
        account.description = req.body.description;
        userAccount.save()
        .then(userAccount => {
            const data = ({
                account: account,
                message: "Updated account successfully"
            })
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while updating the account."
            })
        })
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while updating the account."
        })
    });

    // Account.findByIdAndUpdate(req.params.accountId, {
    //     title: req.body.title,
    //     description: req.body.description
    // }, {new: true})
    // .then(account => {
    //     if(!account) {
    //         return res.status(404).send({
    //             message: "Account not found with id " + req.params.accountId
    //         });
    //     }
    //     // res.send(note);
    //     const data = {
    //         account: account,
    //         message: "Updated account successfully!"
    //     }
    //     res.send(data);
    // }).catch(err => {
    //     if(err.kind === 'ObjectId') {
    //         return res.status(404).send({
    //             message: "Account not found with id " + req.params.accountId
    //         });                
    //     }
    //     return res.status(500).send({
    //         message: "Error updating account with id " + req.params.accountId
    //     });
    // });
};

// Delete a account with the specified accountId in the request
exports.delete = (req, res) => {

    UserAccount.findOne({ userId: { $eq: req.user._id } })
    .then(userAccount => {
        userAccount.accounts.remove(req.params.accountId)
        userAccount.save()
        .then(account => {
        if(!account) {
            return res.status(404).send({
                message: "Account not found with id " + req.params.accountId
            });
        }
        res.send({message: "Account deleted successfully!"});
        }).catch(err => {
            if(err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Account not found with id " + req.params.accountId
                });                
            }
            return res.status(500).send({
                message: "Could not delete account with id " + req.params.accountId
            });
        });
    })
    .catch(err => {
        return res.status(500).send({
            message: "Could not find user account with id " + req.user._id
        });
    })

    // Account.findByIdAndRemove(req.params.accountId)
    // .then(account => {
    //     if(!account) {
    //         return res.status(404).send({
    //             message: "Account not found with id " + req.params.accountId
    //         });
    //     }
    //     res.send({message: "Account deleted successfully!"});
    // }).catch(err => {
    //     if(err.kind === 'ObjectId' || err.name === 'NotFound') {
    //         return res.status(404).send({
    //             message: "Account not found with id " + req.params.accountId
    //         });                
    //     }
    //     return res.status(500).send({
    //         message: "Could not delete account with id " + req.params.accountId
    //     });
    // });
};
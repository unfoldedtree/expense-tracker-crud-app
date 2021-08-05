const Account = require('../models/account.model.js');

// Create and Save a new account
exports.create = (req, res) => {
    // Validate request
    // if(!req.body.content) {
    //     return res.status(400).send({
    //         message: "Note content can not be empty"
    //     });
    // }

    // Create a account
    const account = new Account({
        title: req.body.title || "Untitled Account", 
        description: req.body.description || "No Description"
    });

    // Save account in the database
    account.save()
    .then(account => {
        const data = {
            account: account,
            message: "Created account successfully!"
        }
        res.send(data);
        // res.redirect('/')
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the account."
        });
    });
};

// Retrieve and return all accounts from the database.
exports.findAll = (req, res) => {
    Account.find()
    .then(accounts => {
        res.send(accounts);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving accounts."
        });
    });
};

// Find a single account with a accountId
exports.findOne = (req, res) => {
    Account.findById(req.params.accountId)
    .then(account => {
        if(!account) {
            return res.status(404).send({
                message: "Account not found with id " + req.params.accountId
            });            
        }
        res.send(account);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Account not found with id " + req.params.accountId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving account with id " + req.params.accountId
        });
    });
};

// Update a account identified by the accountId in the request
exports.update = (req, res) => {
    // Validate Request
    // if(!req.body.content) {
    //     return res.status(400).send({
    //         message: "Note content can not be empty"
    //     });
    // }

    // Find account and update it with the request body
    Account.findByIdAndUpdate(req.params.accountId, {
        title: req.body.title,
        description: req.body.description
    }, {new: true})
    .then(account => {
        if(!account) {
            return res.status(404).send({
                message: "Account not found with id " + req.params.accountId
            });
        }
        // res.send(note);
        const data = {
            account: account,
            message: "Updated account successfully!"
        }
        res.send(data);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Account not found with id " + req.params.accountId
            });                
        }
        return res.status(500).send({
            message: "Error updating account with id " + req.params.accountId
        });
    });
};

// Delete a account with the specified accountId in the request
exports.delete = (req, res) => {
    Account.findByIdAndRemove(req.params.accountId)
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
};
module.exports = (app) => {
    const accounts = require('../controllers/account.controller.js')

    // Create a new Account
    app.post('/account', accounts.create);

    // Retrieve all Accounts
    app.get('/accounts', accounts.findAll);

    // Retrieve a single Account with accountId
    app.get('/accounts/:accountId', accounts.findOne);

    // Update a Account with accountId
    app.put('/accounts/:accountId', accounts.update);

    // Delete a Account with accountId
    app.delete('/account/:accountId', accounts.delete);
}
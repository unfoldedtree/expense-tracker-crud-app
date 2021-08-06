module.exports = (app) => {
    const accounts = require('../controllers/account.controller.js')
    require('../auth/auth.passport.js')(app)

    const accessProtectionMiddleware = (req, res, next) => {  
        if (req.isAuthenticated()) {
            next();
        } else {
            res.status(403).json({
                message: 'must be logged in to make those calls',
            });
            // res.redirect('/login')
        }
    };

    // Create a new Account
    app.post('/account', accessProtectionMiddleware, accounts.create);

    // Retrieve all Accounts
    app.get('/accounts', accessProtectionMiddleware, accounts.findAll);

    // Retrieve a single Account with accountId
    app.get('/accounts/:accountId', accessProtectionMiddleware, accounts.findOne);

    // Update a Account with accountId
    app.put('/accounts/:accountId', accessProtectionMiddleware, accounts.update);

    // Delete a Account with accountId
    app.delete('/account/:accountId', accessProtectionMiddleware, accounts.delete);
}
module.exports = (app) => {
    const Expense = require('../models/expense.model.js');
    const Account = require('../models/account.model.js');
    const axios = require('axios');
    require('./expenses.routes.js')(app)
    require('../auth/auth.passport.js')(app)
    require('./accounts.routes.js')(app)

    const accessProtectionMiddleware = (req, res, next) => {  
        if (req.isAuthenticated()) {
            next();
        } else {
            // res.status(403).json({
            //     message: 'must be logged in to continue',
            // });
            res.redirect('/login')
        }
    };

    // Load Index Page
    app.get('/', accessProtectionMiddleware, (req, res) => {
        // console.log(req.user)
        res.render('accounts.ejs')
    })

    app.get('/account', accessProtectionMiddleware, (req, res) => {
        // console.log(req.user)
        res.render('transactions.ejs')
    })

    app.get('/index', accessProtectionMiddleware, (req, res) => {
        // console.log(req.user)
        res.redirect('/');
    })
}
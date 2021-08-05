module.exports = (app) => {
    const Expense = require('../models/expense.model.js');
    const Account = require('../models/account.model.js');
    const axios = require('axios');
    require('./expenses.routes.js')(app)
    require('./accounts.routes.js')(app)

    // Load Index Page
    // app.get('/', (req, res) => {
    //     Expense.find()
    //     .then((resp) => {
    //         res.render('index.ejs', { expense : resp })
    //     })
    //     .catch((error) => {
    //         console.log(error)
    //     })
    // })

    app.get('/', (req, res) => {
        // Account.find()
        // .then((resp) => {
        //     res.render('accounts.ejs', { account : resp })
        // })
        // .catch((error) => {
        //     console.log(error)
        // })
        res.render('accounts.ejs')
    })

    app.get('/accounttest', (req, res) => {
        res.render('transactions.ejs')
    //     Account.find()
    //     .then(account => {
    //         res.render('transactions.ejs')
    //     }).catch(err => {
    //     res.status(500).send({
    //         message: err.message || "Some error occurred while retrieving accounts."
    //     });
    // });
    })

    app.get('/index', (req, res) => {
        res.redirect('/');
    })
}
module.exports = (app) => {
    const expenses = require('../controllers/expense.controller.js');
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

    // // Create a new Expense
    // app.post('account/:accountId/expense', expenses.create);

    // // Retrieve all Expenses
    // app.get('account/:accountId/expenses', expenses.findAll);

    // // Retrieve a single Expense with expenseId
    // app.get('account/:accountId/expenses/:expenseId', expenses.findOne);

    // // Update a Expense with expenseId
    // app.put('account/:accountId/expenses/:expenseId', expenses.update);

    // // Delete a Expense with expenseId
    // app.delete('account/:accountId/expense/:expenseId', expenses.delete);

    // // Create a new Expenses
    app.post('/expense', accessProtectionMiddleware, expenses.create);

    // Retrieve all Expenses
    app.get('/expenses', accessProtectionMiddleware, expenses.findAll);

    // Retrieve a single Expense with expenseId
    app.get('/expenses/:expenseId', accessProtectionMiddleware, expenses.findOne);

    // Update a Expense with expenseId
    app.put('/expense/:accountId/:expenseId', accessProtectionMiddleware, expenses.update);

    // Delete a Expense with expenseId
    app.delete('/expense/:accountId/:expenseId', accessProtectionMiddleware, expenses.delete);
}
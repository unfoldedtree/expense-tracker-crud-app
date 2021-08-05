module.exports = (app) => {
    const expenses = require('../controllers/expense.controller.js');

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
    app.post('/expense', expenses.create);

    // Retrieve all Expenses
    app.get('/expenses', expenses.findAll);

    // Retrieve a single Expense with expenseId
    app.get('/expenses/:expenseId', expenses.findOne);

    // Update a Expense with expenseId
    app.put('/expense/:accountId/:expenseId', expenses.update);

    // Delete a Expense with expenseId
    app.delete('/expense/:accountId/:expenseId', expenses.delete);
}
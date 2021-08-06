const list = document.getElementById('list')
const form = document.getElementById('form')
const title = document.getElementById('title')
const description = document.getElementById('description')
const dropBtn = document.getElementById('drop-btn')
const addAccountDiv = document.getElementById('add-account-div')

let accounts = [];

dropBtn.addEventListener('click', () => {
    addAccountDiv.classList.toggle('hidden')
    dropBtn.classList.toggle('hidden')
})

//Add account
async function addTransaction(e) {
    try {
        e.preventDefault()

        if (title.value.trim() === '' || description.value.trim() === '') {
            alert('Please add a text and amount')
        } else {
            const { data } = await axios.post('/account', {
                title: title.value,
                description: description.value
            })

            addAccountDOM(data.account)

            title.value = ''
            description.value = ''
        }
    } catch(err) {
        console.log(err)
    }
}

// Add accounts to DOM list
function addAccountDOM(account, updating = false) {

    let item;

    if (updating) {
        item = document.getElementById(account._id)
    } else {
        item = document.createElement('div')
        item.id = account._id
        item.classList.add('account-container')
    }

    item.innerHTML = `
        <div class="account-header">
            <form class="account-input edit-hidden">
                <input class="input-title" value="${account.title}" placeholder="${account.title}" />
                <input class="input-description" value="${account.description}" placeholder="${account.description}" />
            </form>
            <div class="title-row">
                <h4 class="account-title">${account.title}</h4>
            </div>
            <div class="drop-description"><a><i class="fas fa-caret-down"></i></a></div>
        </div>
            <div class="description-row hidden">
                <p>${account.description}</p>
            </div>
        <div class="inc-exp-container">
            <div>
                <h4>Total</h4>
                <p id="money-total" class="money"></p>
            </div>
            <div>
                <h4>Income</h4>
                <p id="money-plus" class="money plus"></p>
            </div>
            <div>
                <h4>Expense</h4>
                <p id="money-minus" class="money minus"></p>
            </div>
            <div class="modify-account">
                <a class="edit-btn"><i class="fas fa-edit"></i></a>
                <a class="delete-btn"><i class="fas fa-trash"></i></a>
            </div>
        </div>
    `

    const deleteBtn = item.querySelector('.delete-btn')
    const editBtn = item.querySelector('.edit-btn')
    const accountTitle = item.querySelector('.account-title')
    const accountInput = item.querySelector('.account-input')
    const accountDescription = item.querySelector('.description-row')
    const descriptionBtn = item.querySelector('.drop-description')

    item.addEventListener('dblclick', (e) =>  {
        const noRedirect = '.account-input, .account-input *, .modify-account, .modify-account *, .drop-description, .drop-description *';
        if (!e.target.matches(noRedirect)) {
            document.location.href = `/account?id=${account._id}`
        }
    })

    descriptionBtn.addEventListener('click', () => {
        descriptionBtn.classList.toggle('hidden')
        accountDescription.classList.toggle('hidden')

        //Remove Edit Fields if you toggle description
        accountTitle.classList.remove('edit-hidden')
        accountInput.classList.add('edit-hidden')
    })

    accountInput.addEventListener('keypress', (e) => {
        if (e.keyCode === 13) {
            e.preventDefault()
            const title = accountInput.querySelector('.input-title').value;
            const description = accountInput.querySelector('.input-description').value;
            const newAccount = {
                title: title,
                description: description
            }
            updateAccount(account._id, newAccount)
        }        
    })

    editBtn.addEventListener('click', () => {
        //Remove description from view if edit is toggled
        descriptionBtn.classList.remove('hidden')
        accountDescription.classList.add('hidden')

        accountTitle.classList.toggle('edit-hidden')
        accountInput.classList.toggle('edit-hidden')

        if(!accountInput.classList.contains('edit-hidden')) {
            accountInput.querySelector('input').focus();
        }
    })

    deleteBtn.addEventListener('click', () => {
        removeAccount(account._id)
    })

    updateValues(item, account)

    if (!updating) {
        list.appendChild(item)
    }
}

//Update the balance, income, and expense for an account
function updateValues(item, account) {
    const balance = item.querySelector('#money-total')
    const money_plus = item.querySelector('#money-plus')
    const money_minus = item.querySelector('#money-minus')
    let total;
    let income;
    let expense;

    if (account.transactions) {

        const amounts = account.transactions.map(transaction => transaction.amount)

        total = amounts
            .reduce((acc, item) => (acc += item), 0)
            .toFixed(2)

        income = amounts
            .filter(item => item > 0)
            .reduce((acc, item) => (acc += item), 0)
            .toFixed(2)

        expense = (amounts
            .filter(item => item < 0)
            .reduce((acc, item) => (acc += item), 0) * -1)
            .toFixed(2)
    } else {
        total = (0).toFixed(2);
        income = (0).toFixed(2);
        expense = (0).toFixed(2);
    }

    // const balanceSign = total.amount < 0 ?  '-' : '+'
    // const incomeSign = income.amount < 0 ?  '-' : '+'
    // const expenseSign = expense.amount < 0 ?  '-' : '+'

    balance.innerText = `$${total}`
    money_plus.innerText = `$${income}`
    money_minus.innerText = `$${expense}`
}

//Remove Account by ID
async function removeAccount(id) {
    const { data } = await axios.delete(`/account/${id}`)

    document.getElementById(id).remove()
}

async function updateAccount(id, newAccount) {
    const { data } = await axios.put(`/accounts/${id}`, {
        title: newAccount.title,
        description: newAccount.description
    })

    addAccountDOM(data.account, true)
}

//Return all accounts
async function getDocuments() {
    const results = await axios.get('/accounts')

    return results.data.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
}

async function init() {
    list.innerHTML = '';
    const data = await getDocuments()

    if ( data ) {
        data.forEach(account => addAccountDOM(account))
    }
}

init()

form.addEventListener('submit', addTransaction)
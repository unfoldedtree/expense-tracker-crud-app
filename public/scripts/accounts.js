const list = document.getElementById('list')
const form = document.getElementById('form')
const title = document.getElementById('title')
const description = document.getElementById('description')

let accounts = [];

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
function addAccountDOM(account) {

    const item = document.createElement('div')
    item.id = account._id

    item.classList.add('account-container')

    item.innerHTML = `
        <div>
            <h4>${account.title}</h4>
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

    item.addEventListener('click', (e) =>  {
        const noRedirect = '.modify-account, .modify-account *';
        if (!event.target.matches(noRedirect)) {
            document.location.href = `/account?id=${account._id}`
        }
    })

    deleteBtn.addEventListener('click', () => {
        removeAccount(account._id)
    })

    updateValues(item, account)
    list.appendChild(item)
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

async function getDocuments() {
    return await axios.get('/accounts')
}

async function init() {
    list.innerHTML = '';
    const { data } = await getDocuments()

    if ( data ) {
        data.forEach(addAccountDOM)
    }
}

init()

form.addEventListener('submit', addTransaction)
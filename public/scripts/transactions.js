const balance = document.getElementById('balance')
const money_plus = document.getElementById('money-plus')
const money_minus = document.getElementById('money-minus')
const list = document.getElementById('list')
const form = document.getElementById('form')
const text = document.getElementById('text')
const amount = document.getElementById('amount')
const backBtn = document.getElementById('back-btn')
const addDiv = document.getElementById('add-drop-btn')
const account_title = document.getElementById('account-title')

let transactions = [];

const urlParams = new URLSearchParams(window.location.search);
const account_id = urlParams.get('id')

backBtn.addEventListener('click', () => {
    document.location.href = '/'
})

addDiv.addEventListener('click', () => {
    const historyLabel = document.querySelector(".history-label")
    const addLabel = document.querySelector(".add-new-label")
    const addNewDiv = document.querySelector(".add-new")

    historyLabel.classList.toggle('hide')
    addLabel.classList.toggle('hide')
    addNewDiv.classList.toggle('hide')
    addDiv.classList.toggle('add')

    if (!addNewDiv.classList.contains('hide')) {
        text.focus()
    }
})

// Add transcations to DOM list
function addTransactionDOM(transaction, updating = false) {
    let item;

    if (updating) {
        item = document.getElementById(transaction._id)
        item.className = ''
    } else {
        item = document.createElement('li')
        item.id = transaction._id
    }

    const sign = transaction.amount < 0 ?  '-' : '+'

    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus')

    item.innerHTML = `
        <div class="transaction-info">${transaction.text} <span>${sign}${Math.abs(transaction.amount).toFixed(2)}</span></div>
        <form class="transaction-input edit-hidden">
            <input class="input-text" value="${transaction.text}" placeholder="${transaction.text}" />
            <input class="input-amount" type="number" value="${transaction.amount.toFixed(2)}" placeholder="${transaction.amount.toFixed(2)}" />
        </form>
        <button class="delete-btn"><i class="fas fa-times"></i></button>
    `

    const deleteBtn = item.querySelector('.delete-btn')
    const transactionInfo = item.querySelector('.transaction-info')
    const transactionInput = item.querySelector('.transaction-input')

    deleteBtn.addEventListener('click', () => {
        removeTransaction(transaction._id)
    })

    transactionInput.addEventListener("keypress", (e) => {
        if (e.keyCode === 13) {
            e.preventDefault()
            const text = item.querySelector('.input-text')
            const amount = item.querySelector('.input-amount')

            if (text.value.trim() === '' || amount.value.trim() === '') {
            alert('Please add a text and amount')
            } else {
                const newTransaction = {
                account_id: account_id,
                text: text.value,
                amount: +amount.value
                }
                updateTransaction(transaction._id, newTransaction)
            }
        }
    })

    item.addEventListener('dblclick', (e) => {
        const noRedirect = '.delete-btn, .delete-btn *, .input-text, .input-amount';
        if (!e.target.matches(noRedirect)) {
            transactionInfo.classList.toggle('edit-hidden')
            transactionInput.classList.toggle('edit-hidden')
            
            if(!transactionInput.classList.contains('edit-hidden')) {
                transactionInput.querySelector('.input-text').focus();
            }
        }
    })

    if (!updating) {
        transactions.push(transaction)
        list.appendChild(item)
    } else {
        //TODO When Updating Remove Old Transaction From Transactions Array and Replace it With The New One
        transactions = transactions.filter(item => item._id !== transaction._id)
        transactions.push(transaction)
    }
    updateValues()
}

//Update the balance, income, and expense
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount)

    const total = amounts
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2)

    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2)

    const expense = (amounts
        .filter(item => item < 0)
        .reduce((acc, item) => (acc += item), 0) * -1)
        .toFixed(2)
    

    balance.innerText = `$${total}`
    money_plus.innerText = `+${income}`
    money_minus.innerText = `-${expense}`
}

//Add transaction
async function addTransaction(e) {
    try {
        e.preventDefault()

        if (text.value.trim() === '' || amount.value.trim() === '') {
            alert('Please add a text and amount')
        } else {
            const { data } = await axios.post(`/expense`, {
                account_id: account_id,
                text: text.value,
                amount: +amount.value
            })

            addTransactionDOM(data.expense)

            updateValues();

            text.value = ''
            amount.value = ''
        }
    } catch(err) {
        console.log(err)
    }
}

//Remove Transaction by ID
async function removeTransaction(transaction_id) {
    const { data } = await axios.delete(`/expense/${account_id}/${transaction_id}`)

    document.getElementById(transaction_id).remove()

    transactions = transactions.filter(transaction => transaction._id !== transaction_id)

    updateValues()
}

//Update Transaction by ID
async function updateTransaction(transaction_id, newTransaction) {
    try {
        const { data } = await axios.put(`/expense/${account_id}/${transaction_id}`, newTransaction)

        addTransactionDOM(data.expense, true)

        updateValues()

    } catch (err) {
        console.log(err)
    }
}

async function getDocuments() {
    return await axios.get(`/accounts/${account_id}`)
}

function capitalizeFirstLetters(str){
    return str.toLowerCase().replace(/^\w|\s\w/g, function (letter) {
        return letter.toUpperCase();
    })
}

async function init() {
    list.innerHTML = '';
    const { data } = await getDocuments()

    account_title.innerHTML = `${capitalizeFirstLetters(data.title)} Transactions`

    if ( data.transactions ) {
        data.transactions.forEach(transaction => addTransactionDOM(transaction))
    }
    updateValues()
}

init()

form.addEventListener('submit', addTransaction)
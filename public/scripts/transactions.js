const balance = document.getElementById('balance')
const money_plus = document.getElementById('money-plus')
const money_minus = document.getElementById('money-minus')
const list = document.getElementById('list')
const form = document.getElementById('form')
const text = document.getElementById('text')
const amount = document.getElementById('amount')

let transactions = [];

const urlParams = new URLSearchParams(window.location.search);
const account_id = urlParams.get('account')

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

// Add transcations to DOM list
function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ?  '-' : '+'

    const item = document.createElement('li')
    item.id = transaction._id

    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus')

    item.innerHTML = `
        ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
        <button class="delete-btn">x</button>
    `

    const deleteBtn = item.querySelector('.delete-btn')

    deleteBtn.addEventListener('click', () => {
        removeTransaction(transaction._id)
    })

    transactions.push(transaction)
    list.appendChild(item)
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
    money_plus.innerText = `$${income}`
    money_minus.innerText = `$${expense}`
}

//Remove Transaction by ID
async function removeTransaction(id) {
    const { data } = await axios.delete(`/expense/${account_id}/${id}`)
    // const { data } = await axios.delete(`/expense/${id}`, { params: { account_id: account_id, id: id } })

    document.getElementById(id).remove()

    transactions = transactions.filter(transaction => transaction._id !== id)

    updateValues()
}

async function getDocuments() {
    // return await axios.get('/expenses')
    return await axios.get(`/accounts/${account_id}`)
}

async function init() {
    list.innerHTML = '';
    const { data } = await getDocuments()

    if ( data.transactions ) {
        data.transactions.forEach(addTransactionDOM)
    }
    updateValues()
}

init()

form.addEventListener('submit', addTransaction)
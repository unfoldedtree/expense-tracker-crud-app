const balance = document.getElementById('balance')
const money_plus = document.getElementById('money-plus')
const money_minus = document.getElementById('money-minus')
const list = document.getElementById('list')
const form = document.getElementById('form')
const text = document.getElementById('text')
const amount = document.getElementById('amount')
const backBtn = document.getElementById('back-btn')
const account_title = document.getElementById('account-title')

let transactions = [];

const urlParams = new URLSearchParams(window.location.search);
const account_id = urlParams.get('id')

backBtn.addEventListener('click', () => {
    document.location.href = '/'
})

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
        <button class="delete-btn"><i class="fas fa-times"></i></button>
    `

    const deleteBtn = item.querySelector('.delete-btn')

    deleteBtn.addEventListener('click', () => {
        removeTransaction(transaction._id)
    })

    item.addEventListener('dblclick', (e) => {
        const noRedirect = '.delete-btn, .delete-btn *';
        if (!e.target.matches(noRedirect)) {
            console.log("DOUBLE CLICKED")
        }
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

    document.getElementById(id).remove()

    transactions = transactions.filter(transaction => transaction._id !== id)

    updateValues()
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
        data.transactions.forEach(addTransactionDOM)
    }
    updateValues()
}

init()

form.addEventListener('submit', addTransaction)
const DB_USER = process.env['DB_USER']
const DB_PASS = process.env['DB_PASS']
const DB_STRING = process.env['DB_STRING']

const connectionString = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_STRING}?retryWrites=true&w=majority`

module.exports = {
    url: connectionString
}
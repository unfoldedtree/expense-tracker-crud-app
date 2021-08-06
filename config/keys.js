const DB_USER = process.env['DB_USER']
const DB_PASS = process.env['DB_PASS']
const DB_STRING = process.env['DB_STRING']

const connectionString = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_STRING}?retryWrites=true&w=majority`

module.exports = {
   mongodb:{
    dbURI: connectionString
  },
  google:{
    clientID: "761068962795-8crrs7680u6moqo7ku57fodtl8qkegjq.apps.googleusercontent.com",
    clientSecret:"DlO0u7_A3plRNCxGHC-fipfS"
  },
  session:{
    cookieKey:"cookie_key_set_up_by_you"
  }
};
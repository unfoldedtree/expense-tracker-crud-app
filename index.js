const express = require('express')
const bodyParser= require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('public'))

app.use(bodyParser.json()) 

// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

require('./app/routes/pages.routes.js')(app);



const server = app.listen((process.env.PORT || 3000), () => {
    const port = server.address().port;
    console.log(`Express is working on port ${port}.`)
})

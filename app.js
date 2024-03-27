const express = require("express");         // for express module
const app = express();                      // saving express function to variable app
require("./config/connection");             // importing mongoose or mongodb connection
const path = require('path');               // for path module
var hbs = require("express-handlebars");    // for hbs module to setup view engine

// Importing routes
const createRouter = require('./routes/Create'); 
const readRouter = require('./routes/Read');
const updateRouter = require('./routes/Update');
const deleteRouter = require('./routes/Delete');

// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies (normally used for parsing form json data)
app.use(express.json());  

// Middleware function to serve static files such as styles / js / images
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup (here we have set up Handlebars - hbs view engine)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Middleware to match request routes
app.use('/', createRouter);
app.use('/read', readRouter);
app.use('/update', updateRouter);
app.use('/delete', deleteRouter);

app.listen(3000, () => {
    console.log(`app listening on port ${3000}`);
});

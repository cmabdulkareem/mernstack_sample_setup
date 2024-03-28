const express = require("express");         // for express module
const app = express();                      // saving express function to variable app
require("./config/connection");             // importing mongoose or mongodb connection
const path = require('path');               // for path module
var hbs = require("express-handlebars");    // for hbs module to setup view engine
var session = require('express-session')    // for express session creation

// Importing routes
const createRouter = require('./routes/Create'); 
const readRouter = require('./routes/Read');
const updateRouter = require('./routes/Update');
const deleteRouter = require('./routes/Delete');
const userRouter = require('./routes/user');

// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Set up session middleware with 60-second timeout
app.use(session({
    secret: 'your_secret_key', // Secret key to sign the session ID cookie
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 } // Set maxAge to 60000 milliseconds (60 seconds)
}));



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
app.use('/user', userRouter);

app.listen(3000, () => {
    console.log(`app listening on port ${3000}`);
});

const express = require("express");         // for express module
const http = require("http");
const socketIo = require("socket.io");
const app = express();                      // saving express function to variable app
const server = http.createServer(app);
const io = socketIo(server);
require("./config/connection");             // importing mongoose or mongodb connection
const path = require('path');               // for path module
var hbs = require("express-handlebars");    // for hbs module to setup view engine
var session = require('express-session')  // for express session and cookies
var fileUpload = require("express-fileupload"); // for file upload middleware to manage file uploads

// Importing routes
const adminRouter = require('./routes/admin'); 
const userRouter = require('./routes/user')


// Socket.IO event listeners
io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Middleware for session
app.use(session({
    secret : "arandomkey",
    resave: false,
    saveUninitialized: false,
    cookie : {maxAge: 60000}
}))

// Middleware to parse JSON bodies (normally used for parsing form json data)
app.use(express.json());  

// Middleware for fileUpload
app.use(fileUpload());

// Middleware function to serve static files such as styles / js / images
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup (here we have set up Handlebars - hbs view engine)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({
    extname : 'hbs',
    defaultLayout : "layout",
    layoutsDir: __dirname + '/views/layout/',
    partialsDir: __dirname + '/views/partials'
}));

// Middleware to match request routes
app.use('/',userRouter);
app.use('/admin', adminRouter);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`app listening on port ${PORT}`));
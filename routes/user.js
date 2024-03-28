const express = require("express");
const UserModel = require("../helpers/user-helper");
const router = express.Router();
const bcrypt = require('bcrypt');

// Render user registration page
router.get('/', (req, res) => {
    res.render('user');
});

//Hashing password using bcrypt module for signup
router.post('/signup', (req, res) => {
    bcrypt.hash(req.body.password, 10)
        .then((hashedPassword) => {
            req.body.password = hashedPassword;
            return UserModel.create(req.body); 
        })
        .then((user) => {
            res.redirect(303, '/user/login'); // Use status code 303 for redirect after POST
        })
        .catch((error) => {
            res.status(400).send(error);
        });
});

// Render login page
router.get('/login', (req, res) => {
    res.render('user/login');
});

// Handle user login
router.post('/login', (req, res) => {
    const { userName, password } = req.body;

    // Find the user by username
    UserModel.findOne({ userName })
        .then((user) => {
            if (!user) {
                return res.status(404).send("User not found");
            }

            // Compare hashed password
            bcrypt.compare(password, user.password)
                .then((result) => {
                    if (result) {
                        // Store user information in session upon successful login
                        req.session.userName = userName;
                        res.redirect('/user/userpage');
                    } else {
                        res.status(401).send("Invalid password");
                    }
                })
                .catch((error) => {
                    res.status(500).send(error);
                });
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});

// Render userpage upon successful login
router.get('/userpage', (req, res) => {
    // Check if user is authenticated
    if (req.session && req.session.userName) {
        const userName = req.session.userName;
        res.render('user/userpage', { userName }); // Pass userName to userpage.hbs template
    } else {
        res.redirect('/user/login'); // Redirect to login page if user is not authenticated
    }
});


// Handle user logout
router.post('/logout', (req, res) => {
    // Destroy the session to log out the user
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Internal Server Error');
        } else {
            // Redirect the user to the login page after logout
            res.redirect('/user/login');
        }
    });
});


module.exports = router;

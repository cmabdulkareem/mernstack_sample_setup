const express = require("express");
const UserModel = require("../helpers/user-helper");
const router = express.Router();
const bcrypt = require('bcrypt')

router.get('/', (req, res) => {
    res.render('user');
});


//Hashing password using bcrypt module for signup
router.post('/login', (req, res) => {
    bcrypt.hash(req.body.password, 10)
        .then((hashedPassword) => {
            req.body.password = hashedPassword;
            return UserModel.create(req.body); 
        })
        .then((user) => {
            res.status(201).send(user);
        })
        .catch((error) => {
            res.status(400).send(error);
        });
});

//Login page
router.get('/login', (req, res) => {
    res.render('user/login');
});


// Loggin for validation
router.post('/userpage', (req, res) => {
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

// for redirecting after success loggin
router.get('/userpage', (req, res) => {
    res.render('user/userpage');
});



module.exports = router;
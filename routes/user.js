const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const UserModel = require('../helpers/user-helper')
const ProductModel = require('../helpers/product-helper')


// Creating a middleware to check to verifyLogin
const verifyLogin = (req,res,next)=>{
    if(req.session.loggedIn){
        next()
    }else{
        res.redirect('/login')
    }
}

//user route get method
router.get('/', (req, res) => {
    let user = req.session.user
    res.render('user/userhome', { admin: false, user })
})

//signup route get method
router.get('/signup', (req, res) => {
    res.render('user/signup', { admin: false })
})

//signup route post method for user registration
router.post('/signup', (req, res) => {
    bcrypt.hash(req.body.password, 10)      // hashing body password using bcrypt module
        .then((hashedpassword) => {           // Saving hashed password to variable hashedpassword
            req.body.password = hashedpassword; // Updating body password with hashed password
            return UserModel.create(req.body);
        })
        .then((user) => {
            res.redirect(303, 'login')
        }).catch((error) => {
            console.log(err)
        })
})


// login route get method. 
router.get('/login', (req, res) => {
    if (req.session.userName) {  //if there is a userName in session
        res.redirect('/userpage');  //redirect to userpage
    } else {
        res.render('user/login'); //if not, be in login page
    }
});


// login route post method
router.post('/login', (req, res) => {
    const { userName, password } = req.body;

    UserModel.findOne({ userName })
        .then((user) => {
            if (!user) {
                return res.render('user/login', { errorText: "User not found" });
            }
            bcrypt.compare(password, user.password)
                .then((result) => {
                    if (result) {
                        req.session.loggedIn = true;
                        req.session.userName = userName; // Set userName in session
                        req.session.user = user;
                        res.redirect('/userpage'); // Redirect to '/userpage' upon successful login
                    } else {
                        return res.render('user/login', { errorText: "Invalid password" });
                    }
                })
                .catch((error) => {
                    console.error("Error comparing passwords:", error);
                    res.status(500).send("Internal server error");
                });
        })
        .catch((error) => {
            console.error("Error finding user:", error);
            res.status(500).send("Internal server error");
        });
});



// userpage route get method
router.get('/userpage', (req, res) => {
    if (req.session && req.session.userName) {
        const userName = req.session.userName;
        res.render('user/userpage', { userName })
    } else {
        res.redirect('login')
    }
})


// Logout get request
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session", err);
            res.status(500).send("Internal server error");
        } else {
            console.log("Session destroyed successfully");
            res.redirect('/'); // Redirect to the home page
        }
    });
});


router.get('/cart', verifyLogin, (req,res)=>{
    res.render('user/cart');
});



module.exports = router;
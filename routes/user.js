const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const UserModel = require('../helpers/user-helper')
const ProductModel = require('../helpers/product-helper')

//user route get method
router.get('/',(req,res)=>{
    res.render('user/userhome',{admin:false})
})

//signup route get method
router.get('/signup',(req,res)=>{
    res.render('user/signup',{admin:false})
})

//signup route post method for user registration
router.post('/signup',(req,res)=>{
    bcrypt.hash(req.body.password, 10)      // hashing body password using bcrypt module
        .then((hashedpassword)=>{           // Saving hashed password to variable hashedpassword
            req.body.password = hashedpassword; // Updating body password with hashed password
            return UserModel.create(req.body);
        })
        .then((user)=>{
            res.redirect(303, 'login')
        }).catch((error)=>{
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
router.post('/login',(req,res)=>{
    const {userName, password} = req.body;

    UserModel.findOne({ userName })
    .then((user)=>{
        if(!user){
            return res.render('user/login',{errorText : "user not found"})
            // return res.render('user/login',{errorMessage : "User not found"}) //passing error message to login page
        }
        bcrypt.compare(password, user.password)
        .then((result)=>{
            if(result){
                req.session.userName = userName;
                res.redirect('userpage');
            }else{
                return res.render('user/login',{errorText : "Invalid password"})
            }
        })
        .catch((error)=>{
            res.status(500).send(error);
        });
    })
    .catch((error)=>{
        res.status(500).send(error)
    });
})

// userpage route get method
router.get('/userpage',(req,res)=>{
    if (req.session && req.session.userName){
        const userName = req.session.userName;
        res.render('user/userpage', {userName})
    }else{
        res.redirect('login')
    }
})

// router.get('/',(req,res)=>{
//     ProductModel.find({}).lean()
//         .then((products) => {
//             console.log(products);
//             res.render('partials/user',{products})
//         })
//         .catch((error) => {
//             res.status(500).send(error);
//         });
// });



router.post('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            console.error("error destroying session", err);
            res.status(500).send("Internal server error");
        }else{
            res.redirect('login')
        }
    })
})

module.exports = router;
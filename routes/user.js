const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const UserModel = require('../helpers/user-helper')
const ProductModel = require('../helpers/product-helper')
const CartModel = require('../helpers/cart-helper');

// Creating a middleware to check to verifyLogin
const verifyLogin = (req,res,next) => {
    if(req.session.loggedIn){
        next();
    } else {
        res.redirect('/login');
    }
}

//user route get method
router.get('/', (req, res) => {
    let user = req.session.user;
    ProductModel.find({}).lean()
    .then((products)=>{
        res.render('user/users', {products: products, admin: false, user})
    })
    .catch(error => {
        console.error("Error fetching products:", error);
        res.status(500).send('Internal server error');
    });
});

//signup route get method
router.get('/signup', (req, res) => {
    res.render('user/signup', { admin: false });
});

//signup route post method for user registration
router.post('/signup', (req, res) => {
    bcrypt.hash(req.body.password, 10) // hashing body password using bcrypt module
        .then((hashedpassword) => {     // Saving hashed password to variable hashedpassword
            req.body.password = hashedpassword; // Updating body password with hashed password
            return UserModel.create(req.body);
        })
        .then((user) => {
            res.redirect(303, '/login');
        })
        .catch((error) => {
            console.error("Error creating user:", error);
            res.status(500).send('Internal server error');
        });
});

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
                        req.session.userId = user._id; // Set userId in session
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
        let user = req.session.user;
        res.render('user/userpage', { userName, user });
    } else {
        res.redirect('login');
    }
});

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

// Add product to cart route
router.get('/add-to-cart/:id', verifyLogin, (req, res) => {
    const userId = req.session.userId;
    const productId = req.params.id;

    // Define the update operation
    const updateOperation = {
        $addToSet: { products: productId } // Add productId to the products array if it doesn't already exist
    };

    // Find the cart document for the user and update it
    CartModel.findOneAndUpdate(
        { user: userId },
        updateOperation,
        { upsert: true, new: true } // Create a new cart document if it doesn't already exist
    )
    .then(() => {
        // Redirect to the homepage after adding the product to the cart
        res.redirect('/');
    })
    .catch(error => {
        console.error("Error adding product to cart:", error);
        res.status(500).json({ message: 'Internal server error' });
    });
});

// View cart
router.get('/cart', verifyLogin, (req, res) => {
    const userId = req.session.userId; // Get the user ID from the session

    // Find the cart document for the user in the database
    CartModel.findOne({ user: userId })
        .lean() // Convert Mongoose document to plain JavaScript object
        .populate('products') // Populate the 'products' field in the cart document
        .then(cart => {
            if (!cart) {
                // If the cart does not exist, render the cart page with an empty array of products
                return res.render('user/cart', { products: [] });
            } else {
                // If the cart exists, extract product IDs from the cart
                const productIds = cart.products.map(product => product._id);

                // Use MongoDB aggregation pipeline to retrieve full product details based on product IDs
                ProductModel.aggregate([
                    { $match: { _id: { $in: productIds } } }, // Match products with the specified IDs
                    {
                        $addFields: { // Add a new field to each product document
                            cartItemId: { $arrayElemAt: ['$product._id', 0] } // Extract the product ID
                        }
                    }
                ])
                .then(products => {
                    // Render the cart page with the full product details
                    res.render('user/cart', { products });
                })
                .catch(error => {
                    console.error("Error aggregating products:", error);
                    res.status(500).send('Internal server error');
                });
            }
        })
        .catch(error => {
            console.error("Error fetching cart:", error);
            res.status(500).send('Internal server error');
        });
});



module.exports = router;

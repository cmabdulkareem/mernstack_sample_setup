const express = require("express");
const router = express.Router();
const path = require("path"); // Import the 'path' module
const bcrypt = require('bcrypt');
const UserModel = require('../helpers/user-helper')
const ProductModel = require('../helpers/product-helper')

router.get('/', (req, res)=>{
    ProductModel.find({}).lean()
    .then((products)=>{
        res.render('admin/view-products', {products: products})
    })
})



// router.get('/',(req,res)=>{
//     ProductModel.find({}).lean()
//     .then((products) => {
//         console.log("Products:", products);
//         res.render('admin/view-products', { product: products, admin:true }); // Note: Using singular 'product'
//     })
//     .catch((error) => {
//         console.error("Error fetching products:", error);
//         res.status(500).send(error);
//     });
// })


router.get('/add-products',(req,res)=>{
    res.render('admin/add-products.hbs')
})                                     

router.post('/add-products',(req,res)=>{
    const product = new ProductModel(req.body);
    product.save().then((product)=>{  
        let image = req.files.Image;   //file.mv(__dirname)
        image.mv(path.join(__dirname, '../public/images/product-images', `${product._id}.jpg`), (err)=>{
            if(err){
                console.error(err);
                res.status(500).send(err);
            } else {
                res.render('admin/add-products', { admin:true });
            }
        });
    }).catch((error)=>{
        console.error(error);
        res.status(400).send(error);
    });
})

// Route to handle deletion of products
router.get('/delete-product/:id', (req, res) => {
    const productId = req.params.id;

    // Delete the product based on the product ID
    ProductModel.findByIdAndDelete(productId)
        .then(() => {
            console.log("Product deleted successfully");
            // Redirect to a different page or send a response as needed
            res.redirect('/admin'); // Redirect to the admin page after deletion
        })
        .catch((error) => {
            console.error("Error deleting product:", error);
            res.status(500).send("Error deleting product");
        });
});

router.get('/edit-product/:id', (req, res)=>{
    productId = req.params.id
    console.log(productId)
    ProductModel.findById(productId).lean()
    .then((product)=>{
        console.log(product)
        res.render('admin/edit-product', {product: product})
    })
})

router.post('/edit-product/:id', (req, res)=>{
    productId = req.params.id
    const {itemName, itemDesc, itemPrice} = req.body;

    if(req.files && req.files.Image){
        let image = req.files.Image;

        ProductModel.findByIdAndUpdate(productId, {
            itemName: itemName,
            itemDesc: itemDesc,
            itemPrice: itemPrice
        })
        .then(()=>{
            image.mv(path.join(__dirname, '../public/images/product-images',`${productId}.jpg`), (err)=>{
                if(err){
                    console.log(err);
                    return res.status(500).send(err)
                }
                res.redirect('/admin');
            })
        }).catch((error)=>{
            console.log(error);
            res.status(500).send(error)
        })
    }else{
        ProductModel.findByIdAndUpdate(productId, {
            itemName: itemName,
            itemDesc: itemDesc,
            itemPrice: itemPrice
        })
        .then(()=>{
            res.redirect('/admin')
        }).catch((error)=>{
            res.status(500).send(error);
        })
    }
})



module.exports = router;

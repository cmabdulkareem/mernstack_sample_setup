// index.js inside router folder
const express = require("express");
const ProductModel = require("../helpers/product-helper");
const router = express.Router();

router.get('/', (req, res) => {
    res.render('Create_operations');
});

//Saving a document to the mongodb using .save() method
// router.post('/products',(req,res)=>{
//     const product = new ProductModel(req.body);
//     product.save().then((product)=>{
//         res.status(201).send(product)
//     }).catch((error)=>{
//         res.status(400).send(error);
//     })
// })

// //Create many documents together to mongodb instantly. 
// router.post('/products',(req,res)=>{
//     ProductModel.create(req.body).then((products)=>{
//         res.status(201).send(product)
//     }).catch((error)=>{
//         res.status(400).send(error);
//     })
// })

//Insert many documents together to mongodb using insertMany() method
router.post('/products', (req, res) => {
    ProductModel.insertMany(req.body)
        .then((products) => {
            console.log(products)
            res.status(201).send(products);
        })
        .catch((error) => {
            res.status(400).send(error);
        });
});

module.exports = router;
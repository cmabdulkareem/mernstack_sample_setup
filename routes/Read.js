const express = require("express");
const ProductModel = require("../helpers/product-helper");
const router = express.Router();
require('../config/connection')

router.get('/', (req, res) => {
    res.render('Read_operations');
});


// read, fetch, retrieve all documents from mongodb using .find({}) method 
// head to http://localhost:port/read/prodcuts to view result
router.get('/products', (req, res) => {
    ProductModel.find({})
        .then((products) => {
            res.send(products);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});


//find a document by using it's database id .findById(req.params.id)
// head to http://localhost:port/read/prodcuts/databaseId to view result
router.get('/products/:id', (req, res) => {
    ProductModel.findById(req.params.id)
        .then((product) => {
            if (!product) {
                return res.status(404).send({ message: 'Product not found' });
            }
            res.send(product);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});


// findone specific document(s) by passing a parameter
// head to http://localhost:3000/read/products/id/Banana to see result
router.get('/products/id/:id', (req, res) => {
    ProductModel.findOne({itemName: req.params.id})
        .then((product) => {
            if (!product) {
                return res.status(404).send({ message: 'Product not found' });
            }
            res.send(product);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});


module.exports = router;
// index.js inside router folder
const express = require("express");
const Product = require("../helpers/product-helper");
const router = express.Router();

router.get('/', (req, res) => {
    res.render('Create_operations');
});

router.delete('/fruits/:id', (req, res) => {
    Product.findByIdAndDelete(req.params.id)
        .then((product) => {
            res.send(product)
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});

router.post('/products', (req, res) => {
    Product.insertMany(req.body)
        .then((products) => {
            console.log(products)
            res.status(201).send(products);
        })
        .catch((error) => {
            res.status(400).send(error);
        });
});

router.get('/products', (req, res) => {
    Product.find({})
        .then((products) => {
            res.send(products);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});

module.exports = router;
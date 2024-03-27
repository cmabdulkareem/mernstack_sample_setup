const express = require("express");
const Product = require("../helpers/product-helper");
const router = express.Router();

router.get('/', (req, res) => {
    res.render('Delete_operations');
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


module.exports = router;
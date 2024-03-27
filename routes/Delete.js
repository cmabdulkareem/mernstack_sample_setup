const express = require("express");
const ProductModel = require("../helpers/product-helper");
const router = express.Router();

router.get('/', (req, res) => {
    res.render('Delete_operations');
});

// to delete one document by passing key and value through request body  .findOneAndDelete
// pass a delete request on postman to http://localhost:port/delete/products  with {"key":"value"} json
router.delete('/products', (req, res) => {
    const condition = req.body; // Assuming condition is passed in the request body

    ProductModel.findOneAndDelete(condition)
        .then((deletedProduct) => {
            if (!deletedProduct) {
                return res.status(404).send({ message: 'Product not found' });
            }
            res.send(deletedProduct);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});

module.exports = router;
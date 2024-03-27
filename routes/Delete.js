const express = require("express");
const Product = require("../helpers/product-helper");
const router = express.Router();

router.get('/', (req, res) => {
    res.render('Delete_operations');
});

module.exports = router;
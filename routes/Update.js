const express = require("express");
const Product = require("../helpers/product-helper");
const router = express.Router();

router.get('/', (req, res) => {
    res.render('Update_operations');
});

module.exports = router;
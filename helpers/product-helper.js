const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    itemName: String,
    itemDesc: String,
    itemPrice: Number,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
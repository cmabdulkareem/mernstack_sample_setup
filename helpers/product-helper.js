const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    itemName: String,
    subTitle: String,
    desc: String
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    products : [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}]
})

const CartModel = mongoose.model('Cart', cartSchema)

module.exports = CartModel;
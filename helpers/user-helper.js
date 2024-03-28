const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: String,
    userEmail: String,
    password: String
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
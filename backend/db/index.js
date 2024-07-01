const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://admin:232004Aditya%40mongo@cluster0.dahrvb8.mongodb.net/todo2");
const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    todos: Array,
});
const User = mongoose.model('User', UserSchema);
module.exports = User;
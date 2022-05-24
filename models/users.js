const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_name: { type: String, require: true, maxlength: 100, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    password: { type: String, require: true, maxlength: 100 },
    createdDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('users', userSchema);
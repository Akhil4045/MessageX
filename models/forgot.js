const mongoose = require('mongoose');

const fogotlogSchema = new mongoose.Schema({
    user_name: { type: String, require: true },
    email: { type: String, require: true },
    pin: { type: Number, require: true },
    time: { type: Date, require: true, default: Date.now() }
});

module.exports = mongoose.model('forgotlog', fogotlogSchema);
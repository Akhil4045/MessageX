const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    user_name: { type: String, require: true, maxlength: 100 },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    message: { type: String, required: true },
    send_date: { type: Date, default: Date.now }
});

module.export = mongoose.model('messages', messageSchema);
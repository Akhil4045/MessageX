const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    user_name: { type: String, require: true, maxlength: 100 },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    subject: {type: String, default: 'Message' },
    message: { type: String, required: true },
    send_date: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
    important: {type: Boolean, default: false}
});

module.exports = mongoose.model('messages', messageSchema);
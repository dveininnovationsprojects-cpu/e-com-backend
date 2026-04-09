const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
    email: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['Open', 'Resolved'], default: 'Open' }
}, { timestamps: true });

module.exports = mongoose.model('Support', supportSchema);
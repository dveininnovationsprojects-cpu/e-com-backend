const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, default: '' },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    phone: { type: String, default: '' },
    gender: { type: String, enum: ['male', 'female', 'other', ''], default: '' },
    
    // 🟢 PUDHU ADDRESS FIELDS (Thani thaniya)
    buildingNo: { type: String, default: '' },
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    district: { type: String, default: '' },
    state: { type: String, default: '' }, // State user-eh fill pannatum
    country: { type: String, default: 'India' }, // Default India
    pinCode: { type: String, default: '' },

    qrCode: { type: String, default: "" }, 
    upiId: { type: String, default: "selvamanisellan.18@oksbi" }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
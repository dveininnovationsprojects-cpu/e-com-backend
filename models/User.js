const mongoose = require('mongoose'); // <--- INTHA LINE KANDIPPA IRUKANUM

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, default: '' },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    gender: { type: String, enum: ['male', 'female', 'other', ''], default: '' },
    
    // Ippo intha field-ah mukkoyama add pannunga (Illana QR save aagathu)
    qrCode: { type: String, default: "" }, 
    
    upiId: { type: String, default: "selvamanisellan.18@oksbi" }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
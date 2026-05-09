const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    shippingAddress: { type: String, required: true },
    paymentStatus: { 
        type: String, 
        enum: ['Pending', 'Verified'], 
        default: 'Pending' 
    },
    status: { 
        type: String, 
        enum: ['Placed', 'Delivery Processed', 'Shipped', 'Delivered', 'Cancelled'], 
        default: 'Placed' 
    },
    trackingHistory: [{
        status: String,
        comment: String,
        timestamp: { type: Date, default: Date.now }
    }],
    paymentScreenshot: { type: String },
    whatsappSent: { type: Boolean, default: false }
    
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    // models/Product.js
category: { 
    type: String, 
    required: true,
    enum: [
        'Humic Acid',        
        'Seaweed',           
        'Potassium Humate',  
        'Neem Oil',         
        'Organic Granules', 
        'Fish Oil'           
    ] 
},
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    imageUrl: { type: String, required: true }, 
    images: [String], 
    rating: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
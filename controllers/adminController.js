const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');
const Order = require('../models/Order')

// CREATE - Add New Product
exports.createProduct = async (req, res) => {
    try {
        const { name, category, description, price, stock } = req.body;
        const imageUrl = req.file ? req.file.path : null; // Cloudinary path

        if (!imageUrl) return res.status(400).json({ message: 'Image is required' });

        const product = new Product({ name, category, description, price, stock, imageUrl });
        await product.save();
        res.status(201).json({ message: 'Product added successfully', product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE - Edit Product Details
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        product.name = req.body.name || product.name;
        product.category = req.body.category || product.category;
        product.description = req.body.description || product.description;
        product.price = req.body.price || product.price;
        product.stock = req.body.stock || product.stock;

        if (req.file) {
            product.imageUrl = req.file.path; // Update new image to Cloudinary
        }

        const updatedProduct = await product.save();
        res.json({ message: 'Product updated', updatedProduct });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE - Remove Product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        await product.deleteOne();
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin - Get All Orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'name email phone');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin - Update Order & Payment Status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status, paymentStatus } = req.body;

        // findByIdAndUpdate use panna specific fields mattum update aagum, validation error varathu
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status, paymentStatus },
            { new: true, runValidators: false } // validation off pannidrom update-ku mattum
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
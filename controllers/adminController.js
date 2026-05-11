const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');
const Order = require('../models/Order');
const User = require('../models/User'); // 🟢 Puthusa add pannirukku (User model)

// CREATE - Add New Product with Multiple Images
exports.createProduct = async (req, res) => {
    try {
        // ❌ Pazhaiya line: const { name, category, description, price, stock } = req.body;
        
        // ✅ Pudhu line (mrp add panniyachu):
        const { name, category, description, mrp, price, stock } = req.body; 
        
        // Multiple images handling (req.files use pannanum)
        const images = req.files ? req.files.map(file => file.path) : [];

        if (images.length === 0) {
            return res.status(400).json({ message: 'At least one product image is required bro!' });
        }

        const product = new Product({ 
            name, 
            category, 
            description, 
            mrp, // 👈 Ippo intha mrp error aagadhu, mela define pannitom!
            price, 
            stock, 
            imageUrl: images[0], // First image as thumbnail
            images: images      // Array of all 5 images
        });

        await product.save();
        res.status(201).json({ success: true, product });
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
        product.mrp = req.body.mrp || product.mrp;
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

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status, paymentStatus, comment } = req.body;
        
        const order = await Order.findById(req.params.id);

        if (order) {
            // 1. Main Status update pandrom
            order.status = status || order.status;
            order.paymentStatus = paymentStatus || order.paymentStatus;

            // 2. Ippo antha history array-kulla puthu status-a push pandrom
            // Ithu thaan miss aachu!
            order.trackingHistory.push({ 
                status: status || order.status, 
                comment: comment || `Order status updated to ${status}`,
                timestamp: new Date()
            });

            await order.save();
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// controllers/adminController.js
exports.getAllUsers = async (req, res) => {
    try {
        // Fetch ONLY users who have the role 'user' (excludes 'admin')
        const users = await User.find({ role: 'user' }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateAdminUPI = async (req, res) => {
    try {
        const updateData = {};
        if (req.body.upiId) updateData.upiId = req.body.upiId;

        // PATH use panna thaan Cloudinary URL kidaikkum
        if (req.file) {
            updateData.qrCode = req.file.path; 
        }

        const user = await User.findByIdAndUpdate(
    req.user._id, 
    updateData, 
    { returnDocument: 'after' } 
);

        res.json({ 
            success: true, 
            message: 'QR Updated!', 
            upiId: user.upiId,
            qrCode: user.qrCode // Full https link ippo varum
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Admin details get panna (UPI ID and QR code-kaga)
exports.getAdminSettings = async (req, res) => {
    try {
        const admin = await User.findOne({ role: 'admin' }).select('upiId qrCode');
        res.json(admin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
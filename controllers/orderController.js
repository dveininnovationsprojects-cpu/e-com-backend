const Order = require('../models/Order');


exports.createOrder = async (req, res) => {
    try {
        const { orderItems, totalAmount, shippingAddress } = req.body;
        
        
        const screenshotUrl = req.file ? req.file.path : "";

        const order = new Order({
            user: req.user._id,
            orderItems: JSON.parse(orderItems), 
            totalAmount,
            shippingAddress,
            paymentScreenshot: screenshotUrl 
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (order.status === 'Shipped' || order.status === 'Delivered') {
            return res.status(400).json({ message: 'Cannot cancel. Item already shipped or delivered.' });
        }

        order.status = 'Cancelled';
        await order.save();
        res.json({ message: 'Order cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
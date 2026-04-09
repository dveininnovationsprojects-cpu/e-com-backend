const Order = require('../models/Order');

// 1. Create New Order
exports.createOrder = async (req, res) => {
    try {
        const { orderItems, totalAmount, shippingAddress } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No items in order' });
        }

        const order = new Order({
            user: req.user._id,
            orderItems,
            totalAmount,
            shippingAddress
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Get Logged-in User Orders (Order History)
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Cancel Order (Only if not Shipped/Delivered)
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
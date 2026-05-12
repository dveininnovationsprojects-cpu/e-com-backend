const Support = require('../models/Support');

exports.createTicket = async (req, res) => {
    try {
        const { subject, message } = req.body;
        
        if (!subject || !message) {
            return res.status(400).json({ message: "Subject and message are required" });
        }
        const ticket = await Support.create({
            user: req.user._id,
            subject,
            message
        });

        res.status(201).json({ success: true, ticket });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllTickets = async (req, res) => {
    try {
        const tickets = await Support.find({})
            .populate('user', 'name email')
            .sort({ createdAt: -1 }); 
            
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
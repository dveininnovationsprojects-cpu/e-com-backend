const Support = require('../models/Support');

exports.createSupportTicket = async (req, res) => {
    try {
        const { email, message } = req.body;
        const support = await Support.create({ email, message });
        res.status(201).json({ message: 'Query received. We will contact you soon.', ticket: support });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllTickets = async (req, res) => {
    try {
        const tickets = await Support.find({});
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const Support = require('../models/Support');

// POST: Normal user ticket create pandrathuku (Profile page)
exports.createTicket = async (req, res) => {
    try {
        const { subject, message } = req.body;
        
        if (!subject || !message) {
            return res.status(400).json({ message: "Subject and message are required" });
        }

        // req.user._id -> Protect middleware moolama token-la irunthu kedaikum
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

// GET: Admin ellam tickets-aiyum paarkurathuku (Admin Dashboard)
exports.getAllTickets = async (req, res) => {
    try {
        // .populate() use panni entha user anuppunanga nu name & email-a edukkurom
        const tickets = await Support.find({})
            .populate('user', 'name email')
            .sort({ createdAt: -1 }); // Pudhusaa anupuna message first varum
            
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
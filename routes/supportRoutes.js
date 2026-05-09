const express = require('express');
const router = express.Router();
const { createTicket, getAllTickets } = require('../controllers/supportController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, createTicket);
router.get('/', protect, admin, getAllTickets);

module.exports = router;
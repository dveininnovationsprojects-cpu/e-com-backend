const express = require('express');
const { createSupportTicket } = require('../controllers/supportController');
const router = express.Router();

router.post('/', createSupportTicket);

module.exports = router;
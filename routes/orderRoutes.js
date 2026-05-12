const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, cancelOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

const upload = require('../middleware/uploadMiddleware'); 


router.post('/', protect, upload.single('paymentScreenshot'), createOrder);

router.get('/myorders', protect, getMyOrders);
router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;
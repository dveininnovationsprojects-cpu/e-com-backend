const express = require('express');
const router = express.Router();
const { createProduct, updateProduct, deleteProduct } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { getAllOrders, updateOrderStatus } = require('../controllers/adminController');

// All routes are protected and admin only
router.post('/products', protect, admin, upload.single('image'), createProduct);
router.put('/products/:id', protect, admin, upload.single('image'), updateProduct);
router.delete('/products/:id', protect, admin, deleteProduct);
router.get('/orders', protect, admin, getAllOrders);
router.put('/orders/:id', protect, admin, updateOrderStatus);

module.exports = router;
const express = require('express');
const router = express.Router();
const { 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    getAllOrders, 
    updateOrderStatus, 
    getAllUsers,
    updateAdminUPI,
    getAdminSettings
} = require('../controllers/adminController');

const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');


router.post('/products', protect, admin, upload.array('images', 5), createProduct);
router.put('/products/:id', protect, admin, upload.array('images', 5), updateProduct);
router.delete('/products/:id', protect, admin, deleteProduct);


router.get('/orders', protect, admin, getAllOrders);
router.put('/orders/:id', protect, admin, updateOrderStatus);


router.get('/users', protect, admin, getAllUsers);
// PUT method - upi update-la 'qrCode' image-ah handle panna sollunga
router.put('/update-upi', protect, admin, upload.single('qrCode'), updateAdminUPI);
router.get('/settings', getAdminSettings);

module.exports = router;
const express = require('express');
const { registerUser, loginUser, logoutUser, updateUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser); // Puthu logout route
router.put('/profile', protect, updateUserProfile);

module.exports = router;
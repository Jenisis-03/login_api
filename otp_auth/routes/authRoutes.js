const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);

// Middleware to protect routes
router.get('/profile', require('../middleware/authMiddleware'), (req, res) => {
    res.json({ message: "Access granted", userId: req.userId });
});

module.exports = router;
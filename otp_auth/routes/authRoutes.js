const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const apiLogController = require('../controllers/apiLogController');
const authMiddleware = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');
const apiLogger = require('../middleware/apiLogMiddleware');


router.use(apiLogger);

// Public routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/verify-otp', authController.verifyOtp);

// Protected routes
router.put('/update-profile', authMiddleware, authController.updateProfile);
router.post('/signout', authMiddleware, authController.signout);

// Admin routes
router.post('/admin/create-user', [authMiddleware, checkRole(['admin'])], authController.signup);

// Logs route
router.get('/logs', [authMiddleware, checkRole(['admin'])], apiLogController.getLogs);

module.exports = router;
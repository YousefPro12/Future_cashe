const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

// Apply authentication middleware to all user routes
router.use(authenticateToken);

// Get user profile
router.get('/profile', userController.getProfile);

// Update user profile
router.put('/profile', userController.updateProfile);

// Get user activity history
router.get('/activity', userController.getActivityHistory);

// Get user points history and balance
router.get('/points', userController.getPointsHistory);

// Get user's referrals
router.get('/referrals', userController.getReferrals);

module.exports = router; 
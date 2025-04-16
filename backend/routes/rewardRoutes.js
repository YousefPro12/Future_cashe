const express = require('express');
const router = express.Router();
const rewardController = require('../controllers/rewardController');
const { authenticateToken } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get all available rewards with filtering options
router.get('/', rewardController.getRewards);

// Get reward categories for filtering
router.get('/categories', rewardController.getRewardCategories);

// Get redemption history for current user
router.get('/history', rewardController.getRedemptionHistory);

// Get details of a specific redemption
router.get('/redemptions/:id', rewardController.checkRedemptionStatus);

// Get details of a specific reward
router.get('/:id', rewardController.getRewardById);

// Redeem a reward
router.post('/:id/redeem', rewardController.redeemReward);

module.exports = router; 
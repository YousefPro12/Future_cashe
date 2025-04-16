const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referralController');
const { authenticateToken } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get referral program information
router.get('/info', referralController.getReferralInfo);

// Get user's referrals
router.get('/', referralController.getUserReferrals);

// Get detailed referral statistics 
router.get('/stats', referralController.getReferralStats);

// Validate a referral code
router.post('/validate', referralController.validateReferralCode);

module.exports = router; 
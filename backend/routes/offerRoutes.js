const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const { authenticateToken } = require('../middleware/auth');

// Get all offer walls - public route
router.get('/providers', offerController.getOfferWalls);

// Offer callback from providers - public route
router.post('/callback', offerController.offerCallback);

// Apply authentication middleware to protected routes
router.use(authenticateToken);

// Get all available offers
router.get('/', offerController.getOffers);

// Get offer details by ID
router.get('/:id', offerController.getOfferById);

// Track offer click (before redirect)
router.post('/:id/click', offerController.trackOfferClick);

// Get offer completion history for current user
router.get('/history', offerController.getOfferHistory);

module.exports = router;
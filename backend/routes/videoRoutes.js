const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const { authenticateToken } = require('../middleware/auth');

// Apply authentication middleware to all video routes
router.use(authenticateToken);

// Get all available videos
router.get('/', videoController.getVideos);

// Get video details by ID
router.get('/:id', videoController.getVideoById);

// Start watching a video
router.post('/:id/start', videoController.startWatchingVideo);

// Complete watching a video
router.post('/:id/complete', videoController.completeWatchingVideo);

module.exports = router; 
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get all chat messages
router.get('/messages', chatController.getMessages);

// Send a new message
router.post('/messages', chatController.sendMessage);

// Delete a message (user can delete their own, admin can delete any)
router.delete('/messages/:id', chatController.deleteMessage);

// Get messages from a specific user (admin only)
router.get('/messages/user/:userId', requireAdmin, chatController.getUserMessages);

module.exports = router; 
const { ChatMessage, User } = require('../models');
const { Op } = require('sequelize');

/**
 * Get chat messages
 * @route GET /api/chat/messages
 */
exports.getMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;
    
    const messages = await ChatMessage.findAndCountAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullname', 'email', 'profile_image']
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });
    
    const totalPages = Math.ceil(messages.count / limit);
    
    // Reverse the array to show messages in chronological order
    const sortedMessages = [...messages.rows].reverse();
    
    res.status(200).json({
      messages: sortedMessages,
      pagination: {
        total: messages.count,
        totalPages,
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error('Get chat messages error:', error);
    res.status(500).json({ message: 'Server error while fetching chat messages' });
  }
};

/**
 * Send a chat message
 * @route POST /api/chat/messages
 */
exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;
    
    // Basic validation
    if (!message || message.trim() === '') {
      return res.status(400).json({ message: 'Message cannot be empty' });
    }
    
    // Simple content moderation - you can enhance this with a service
    if (containsOffensiveContent(message)) {
      return res.status(400).json({ message: 'Message contains inappropriate content' });
    }
    
    // Create message
    const chatMessage = await ChatMessage.create({
      user_id: userId,
      message,
      ip_address: req.ip
    });
    
    // Get message with user data for response
    const newMessage = await ChatMessage.findByPk(chatMessage.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullname', 'email', 'profile_image']
        }
      ]
    });
    
    // In a real application, this would trigger a push notification via WebSocket
    // handlePushNotification(newMessage);
    
    res.status(201).json({ 
      message: 'Message sent successfully',
      chatMessage: newMessage
    });
  } catch (error) {
    console.error('Send chat message error:', error);
    res.status(500).json({ message: 'Server error while sending chat message' });
  }
};

/**
 * Delete a chat message (admin only)
 * @route DELETE /api/chat/messages/:id
 */
exports.deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;
    
    const message = await ChatMessage.findByPk(messageId);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    // Admin can delete any message, regular users can only delete their own
    if (!req.admin && message.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this message' });
    }
    
    await message.destroy();
    
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete chat message error:', error);
    res.status(500).json({ message: 'Server error while deleting chat message' });
  }
};

/**
 * Get user's chat messages
 * @route GET /api/chat/messages/user/:userId
 */
exports.getUserMessages = async (req, res) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    // Verify user exists
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get messages by this user
    const messages = await ChatMessage.findAndCountAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      limit,
      offset
    });
    
    const totalPages = Math.ceil(messages.count / limit);
    
    res.status(200).json({
      messages: messages.rows,
      pagination: {
        total: messages.count,
        totalPages,
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error('Get user chat messages error:', error);
    res.status(500).json({ message: 'Server error while fetching user chat messages' });
  }
};

/**
 * Simple content moderation function
 * @param {string} content - Message content to check
 * @returns {boolean} - True if offensive content is found
 */
function containsOffensiveContent(content) {
  // This is a simple example. In production, use a more sophisticated solution.
  const offensiveTerms = [
    'offensive1', 
    'offensive2',
    // Add more terms here
  ];
  
  const contentLower = content.toLowerCase();
  
  return offensiveTerms.some(term => contentLower.includes(term));
}

/**
 * WebSocket notification handler (placeholder)
 * @param {Object} message - The new message to broadcast
 */
function handlePushNotification(message) {
  // Implement WebSocket broadcasting logic here
  // This is just a placeholder - would be implemented with Socket.io or similar
  console.log('New message would be broadcasted:', message.id);
} 
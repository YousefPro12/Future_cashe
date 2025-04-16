const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const analyticsController = require('../controllers/analyticsController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Admin login route (public)
router.post('/login', adminController.login);

// Apply authentication and admin check middleware to all other routes
router.use(authenticateToken);
router.use(requireAdmin);

// Admin profile routes
router.get('/profile', adminController.getProfile);
router.get('/activity', adminController.getActivityLog);

// Dashboard stats
router.get('/dashboard', adminController.getDashboardStats);

// System settings
router.get('/settings', adminController.getSystemSettings);
router.put('/settings/:key', adminController.updateSystemSetting);

// User management
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id/status', adminController.updateUserStatus);

// Analytics
router.get('/analytics/daily', analyticsController.getDailyStats);
router.get('/analytics/retention', analyticsController.getUserRetention);
router.get('/analytics/revenue', analyticsController.getRevenueAnalytics);
router.get('/analytics/engagement', analyticsController.getUserEngagement);

module.exports = router; 
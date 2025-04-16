const { 
  User, 
  Admin, 
  AdminActivityLog, 
  SystemSetting, 
  DailyStat,
  RewardRedemption,
  OfferCompletion,
  VideoView
} = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

/**
 * Admin login
 * @route POST /api/admin/login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, email: admin.email, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_ADMIN_EXPIRES_IN || '12h' }
    );

    // Log activity
    await AdminActivityLog.create({
      admin_id: admin.id,
      activity_type: 'login',
      description: 'Admin login',
      ip_address: req.ip
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        fullname: admin.fullname,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

/**
 * Get admin profile
 * @route GET /api/admin/profile
 */
exports.getProfile = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.admin.id, {
      attributes: { exclude: ['password_hash'] }
    });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({ admin });
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
};

/**
 * Get admin activity log
 * @route GET /api/admin/activity
 */
exports.getActivityLog = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const activities = await AdminActivityLog.findAndCountAll({
      include: [
        {
          model: Admin,
          attributes: ['id', 'email', 'fullname']
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    const totalPages = Math.ceil(activities.count / limit);

    res.status(200).json({
      activities: activities.rows,
      pagination: {
        total: activities.count,
        totalPages,
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error('Get admin activity log error:', error);
    res.status(500).json({ message: 'Server error while fetching activity log' });
  }
};

/**
 * Get system dashboard stats
 * @route GET /api/admin/dashboard
 */
exports.getDashboardStats = async (req, res) => {
  try {
    // Get user counts
    const totalUsers = await User.count();
    const newUsers = await User.count({
      where: {
        created_at: {
          [Op.gte]: new Date(new Date() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      }
    });

    // Get offer completions
    const totalOfferCompletions = await OfferCompletion.count();
    const pendingOfferCompletions = await OfferCompletion.count({
      where: { status: 'pending' }
    });

    // Get video views
    const totalVideoViews = await VideoView.count({
      where: { status: 'completed' }
    });

    // Get reward redemptions
    const totalRedemptions = await RewardRedemption.count();
    const pendingRedemptions = await RewardRedemption.count({
      where: { status: 'pending' }
    });

    // Get daily stats
    const lastWeekStats = await DailyStat.findAll({
      order: [['date', 'DESC']],
      limit: 7
    });

    res.status(200).json({
      user_stats: {
        total_users: totalUsers,
        new_users_24h: newUsers
      },
      offer_stats: {
        total_completions: totalOfferCompletions,
        pending_approvals: pendingOfferCompletions
      },
      video_stats: {
        total_views: totalVideoViews
      },
      redemption_stats: {
        total_redemptions: totalRedemptions,
        pending_fulfillment: pendingRedemptions
      },
      daily_stats: lastWeekStats
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard stats' });
  }
};

/**
 * Get system settings
 * @route GET /api/admin/settings
 */
exports.getSystemSettings = async (req, res) => {
  try {
    const settings = await SystemSetting.findAll();
    
    // Convert to key-value object
    const settingsObj = settings.reduce((obj, setting) => {
      obj[setting.key] = setting.value;
      return obj;
    }, {});
    
    res.status(200).json({ settings: settingsObj });
  } catch (error) {
    console.error('Get system settings error:', error);
    res.status(500).json({ message: 'Server error while fetching system settings' });
  }
};

/**
 * Update system setting
 * @route PUT /api/admin/settings/:key
 */
exports.updateSystemSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    
    const setting = await SystemSetting.findOne({ where: { key } });
    
    if (!setting) {
      return res.status(404).json({ message: 'Setting not found' });
    }
    
    // Update setting
    await setting.update({ value });
    
    // Log activity
    await AdminActivityLog.create({
      admin_id: req.admin.id,
      activity_type: 'setting_update',
      description: `Updated system setting: ${key}`,
      ip_address: req.ip
    });
    
    res.status(200).json({ 
      message: 'Setting updated successfully',
      setting: { key, value }
    });
  } catch (error) {
    console.error('Update system setting error:', error);
    res.status(500).json({ message: 'Server error while updating system setting' });
  }
};

/**
 * Get user management list
 * @route GET /api/admin/users
 */
exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const { search, sortBy, sortOrder } = req.query;
    
    // Build query
    const where = {};
    if (search) {
      where[Op.or] = [
        { email: { [Op.like]: `%${search}%` } },
        { fullname: { [Op.like]: `%${search}%` } }
      ];
    }
    
    // Build sort options
    const order = [];
    if (sortBy) {
      order.push([sortBy, sortOrder === 'desc' ? 'DESC' : 'ASC']);
    } else {
      order.push(['created_at', 'DESC']);
    }
    
    const users = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password_hash'] },
      order,
      limit,
      offset
    });
    
    const totalPages = Math.ceil(users.count / limit);
    
    res.status(200).json({
      users: users.rows,
      pagination: {
        total: users.count,
        totalPages,
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
};

/**
 * Get user details by ID
 * @route GET /api/admin/users/:id
 */
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password_hash'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ user });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching user details' });
  }
};

/**
 * Update user status
 * @route PUT /api/admin/users/:id/status
 */
exports.updateUserStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    const { status } = req.body;
    
    if (!['active', 'suspended', 'banned'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user status
    await user.update({ account_status: status });
    
    // Log activity
    await AdminActivityLog.create({
      admin_id: req.admin.id,
      activity_type: 'user_status_update',
      description: `Updated user ${user.email} status to ${status}`,
      ip_address: req.ip
    });
    
    res.status(200).json({ 
      message: 'User status updated successfully',
      user: {
        id: user.id,
        email: user.email,
        account_status: status
      }
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Server error while updating user status' });
  }
}; 
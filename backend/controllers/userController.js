const { 
  User, 
  UserActivity, 
  Referral, 
  OfferCompletion, 
  VideoView, 
  RewardRedemption,
  UserIpHistory 
} = require('../models');
const { Op } = require('sequelize');

/**
 * Get user profile
 * @route GET /api/user/profile
 */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: {
        exclude: ['password_hash']
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
};

/**
 * Update user profile
 * @route PUT /api/user/profile
 */
exports.updateProfile = async (req, res) => {
  try {
    const { fullname } = req.body;
    
    // Find user
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user information
    const updatedUser = await user.update({ 
      fullname: fullname || user.fullname
    });
    
    // Return user without password
    const userData = updatedUser.toJSON();
    delete userData.password_hash;
    
    res.status(200).json({ 
      message: 'Profile updated successfully',
      user: userData 
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
};

/**
 * Get user activity history
 * @route GET /api/user/activity
 */
exports.getActivityHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const activities = await UserActivity.findAndCountAll({
      where: {
        user_id: req.user.id
      },
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
    console.error('Get activity history error:', error);
    res.status(500).json({ message: 'Server error while fetching activity history' });
  }
};

/**
 * Get user points history and balance
 * @route GET /api/user/points
 */
exports.getPointsHistory = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'points_balance']
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Get activities that affected points
    const pointsActivities = await UserActivity.findAndCountAll({
      where: {
        user_id: req.user.id,
        points_change: {
          [Op.ne]: 0
        }
      },
      order: [['created_at', 'DESC']],
      limit,
      offset
    });
    
    const totalPages = Math.ceil(pointsActivities.count / limit);
    
    res.status(200).json({
      points_balance: user.points_balance,
      activities: pointsActivities.rows,
      pagination: {
        total: pointsActivities.count,
        totalPages,
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error('Get points history error:', error);
    res.status(500).json({ message: 'Server error while fetching points history' });
  }
};

/**
 * Get user's referrals
 * @route GET /api/user/referrals
 */
exports.getReferrals = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'referral_code']
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get referrals with basic user info
    const referrals = await Referral.findAll({
      where: {
        referrer_id: req.user.id
      },
      include: [
        {
          model: User,
          as: 'referred',
          attributes: ['id', 'email', 'fullname', 'created_at']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    
    // Calculate total earnings from referrals
    const totalEarnings = referrals.reduce((sum, ref) => sum + Number(ref.points_earned), 0);
    
    // Count active referrals
    const activeReferrals = referrals.filter(ref => ref.status === 'active').length;
    
    res.status(200).json({
      referral_code: user.referral_code,
      referral_link: `${process.env.FRONTEND_URL || 'https://futurecash.com'}/register?ref=${user.referral_code}`,
      referrals: referrals,
      stats: {
        total_referrals: referrals.length,
        active_referrals: activeReferrals,
        total_earnings: totalEarnings
      }
    });
  } catch (error) {
    console.error('Get referrals error:', error);
    res.status(500).json({ message: 'Server error while fetching referrals' });
  }
};

/**
 * Get user's offer completions
 * @route GET /api/user/offers
 */
exports.getOfferCompletions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const offers = await OfferCompletion.findAndCountAll({
      where: {
        user_id: req.user.id
      },
      include: [
        {
          model: Offer,
          attributes: ['id', 'title', 'points', 'image_url']
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });
    
    const totalPages = Math.ceil(offers.count / limit);
    
    res.status(200).json({
      offers: offers.rows,
      pagination: {
        total: offers.count,
        totalPages,
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error('Get offer completions error:', error);
    res.status(500).json({ message: 'Server error while fetching offer completions' });
  }
};

/**
 * Get user's video views
 * @route GET /api/user/videos
 */
exports.getVideoViews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const videos = await VideoView.findAndCountAll({
      where: {
        user_id: req.user.id
      },
      include: [
        {
          model: Video,
          attributes: ['id', 'title', 'points', 'thumbnail_url']
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });
    
    const totalPages = Math.ceil(videos.count / limit);
    
    res.status(200).json({
      videos: videos.rows,
      pagination: {
        total: videos.count,
        totalPages,
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error('Get video views error:', error);
    res.status(500).json({ message: 'Server error while fetching video views' });
  }
};

/**
 * Get user's reward redemptions
 * @route GET /api/user/rewards
 */
exports.getRewardRedemptions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const rewards = await RewardRedemption.findAndCountAll({
      where: {
        user_id: req.user.id
      },
      include: [
        {
          model: RewardOption,
          attributes: ['id', 'name', 'points_required', 'image_url']
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });
    
    const totalPages = Math.ceil(rewards.count / limit);
    
    res.status(200).json({
      rewards: rewards.rows,
      pagination: {
        total: rewards.count,
        totalPages,
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error('Get reward redemptions error:', error);
    res.status(500).json({ message: 'Server error while fetching reward redemptions' });
  }
};

/**
 * Get user's dashboard summary
 * @route GET /api/user/dashboard
 */
exports.getDashboardSummary = async (req, res) => {
  try {
    // Get user info
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'fullname', 'points_balance', 'referral_code', 'created_at']
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get recent activities (last 5)
    const recentActivities = await UserActivity.findAll({
      where: {
        user_id: req.user.id
      },
      order: [['created_at', 'DESC']],
      limit: 5
    });
    
    // Get count of completed offers
    const offersCount = await OfferCompletion.count({
      where: {
        user_id: req.user.id,
        status: 'approved'
      }
    });
    
    // Get count of watched videos
    const videosCount = await VideoView.count({
      where: {
        user_id: req.user.id,
        status: 'completed'
      }
    });
    
    // Get count of redemptions
    const redemptionsCount = await RewardRedemption.count({
      where: {
        user_id: req.user.id
      }
    });
    
    // Get count of referrals
    const referralsCount = await Referral.count({
      where: {
        referrer_id: req.user.id
      }
    });
    
    // Get total points earned from offers
    const offerPoints = await OfferCompletion.sum('points_awarded', {
      where: {
        user_id: req.user.id,
        status: 'approved'
      }
    });
    
    // Get total points earned from videos
    const videoPoints = await VideoView.sum('points_awarded', {
      where: {
        user_id: req.user.id,
        status: 'completed'
      }
    });
    
    // Get total points spent on rewards
    const rewardPoints = await RewardRedemption.sum('points_used', {
      where: {
        user_id: req.user.id
      }
    });
    
    // Get pending rewards
    const pendingRewards = await RewardRedemption.count({
      where: {
        user_id: req.user.id,
        status: 'pending'
      }
    });
    
    // Get active offers (currently held)
    const pendingOffers = await OfferCompletion.count({
      where: {
        user_id: req.user.id,
        status: 'held'
      }
    });
    
    res.status(200).json({
      user,
      stats: {
        completed_offers: offersCount || 0,
        watched_videos: videosCount || 0,
        redemptions: redemptionsCount || 0,
        referrals: referralsCount || 0,
        pending_rewards: pendingRewards || 0,
        pending_offers: pendingOffers || 0
      },
      points: {
        current_balance: user.points_balance,
        earned_from_offers: offerPoints || 0,
        earned_from_videos: videoPoints || 0,
        spent_on_rewards: rewardPoints || 0,
        earned_total: (offerPoints || 0) + (videoPoints || 0)
      },
      recent_activities: recentActivities
    });
  } catch (error) {
    console.error('Get dashboard summary error:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard summary' });
  }
};

/**
 * Track user IP address
 * @param {Object} req - Express request object
 * @param {number} userId - User ID
 */
exports.trackUserIp = async (req, userId) => {
  try {
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];
    
    // Check if this IP is already recorded for this user
    const existingIp = await UserIpHistory.findOne({
      where: {
        user_id: userId,
        ip_address: ipAddress,
        user_agent: userAgent
      }
    });
    
    // If IP is not recorded, add it
    if (!existingIp) {
      await UserIpHistory.create({
        user_id: userId,
        ip_address: ipAddress,
        user_agent: userAgent,
        // TODO: Add country and region data from geolocation service
      });
    }
    
    return true;
  } catch (error) {
    console.error('Track user IP error:', error);
    return false;
  }
}; 
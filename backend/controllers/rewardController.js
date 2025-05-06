const { 
  RewardOption, 
  RewardRedemption, 
  User, 
  UserActivity 
} = require('../models');
const { Op } = require('sequelize');
const userController = require('./userController');

/**
 * Get all available rewards
 * @route GET /api/rewards
 */
exports.getRewards = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    // Optional filters
    const { category, minPoints, maxPoints, search } = req.query;
    
    // Build where clause based on filters
    const whereClause = {
      status: true
    };
    
    // Apply category filter if provided
    if (category) {
      whereClause.category = category;
    }
    
    // Apply points range filter if provided
    if (minPoints || maxPoints) {
      whereClause.points_required = {};
      if (minPoints) whereClause.points_required[Op.gte] = minPoints;
      if (maxPoints) whereClause.points_required[Op.lte] = maxPoints;
    }
    
    // Apply search filter if provided
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }
    
    // Get rewards
    const rewards = await RewardOption.findAndCountAll({
      where: whereClause,
      order: [
        ['points_required', 'ASC'],
        ['name', 'ASC']
      ],
      limit,
      offset
    });
    
    const totalPages = Math.ceil(rewards.count / limit);
    
    // Get user's points balance
    const user = await User.findByPk(req.user.id, {
      attributes: ['points_balance']
    });
    
    // Mark rewards as affordable for this user
    const formattedRewards = rewards.rows.map(reward => {
      const rewardData = reward.toJSON();
      rewardData.can_afford = user.points_balance >= reward.points_required;
      return rewardData;
    });
    
    res.status(200).json({
      rewards: formattedRewards,
      user_points: user.points_balance,
      pagination: {
        total: rewards.count,
        totalPages,
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error('Get rewards error:', error);
    res.status(500).json({ message: 'Server error while fetching rewards' });
  }
};

/**
 * Get reward details by ID
 * @route GET /api/rewards/:id
 */
exports.getRewardById = async (req, res) => {
  try {
    const rewardId = req.params.id;
    
    const reward = await RewardOption.findByPk(rewardId);
    
    if (!reward) {
      return res.status(404).json({ message: 'Reward not found' });
    }
    
    // Get user's points balance
    const user = await User.findByPk(req.user.id, {
      attributes: ['points_balance']
    });
    
    const rewardData = reward.toJSON();
    rewardData.can_afford = user.points_balance >= reward.points_required;
    
    res.status(200).json({ reward: rewardData });
  } catch (error) {
    console.error('Get reward by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching reward details' });
  }
};

/**
 * Redeem a reward
 * @route POST /api/rewards/:id/redeem
 */
exports.redeemReward = async (req, res) => {
  try {
    const rewardId = req.params.id;
    const { payment_details } = req.body;
    
    if (!payment_details) {
      return res.status(400).json({ message: 'Payment details are required' });
    }
    
    const reward = await RewardOption.findByPk(rewardId);
    
    if (!reward) {
      return res.status(404).json({ message: 'Reward not found' });
    }
    
    // Check if reward is available
    if (!reward.status) {
      return res.status(400).json({ message: 'This reward is currently unavailable' });
    }
    
    // Get user
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user has enough points
    if (user.points_balance < reward.points_required) {
      return res.status(400).json({
        message: 'Insufficient points balance',
        required: reward.points_required,
        balance: user.points_balance
      });
    }
    
    // Track user IP for fraud prevention
    await userController.trackUserIp(req, req.user.id);
    
    // Transaction: deduct points and create redemption
    // In a real implementation, you would use Sequelize transactions
    
    // Deduct points from user's balance
    await user.update({
      points_balance: user.points_balance - reward.points_required
    });
    
    // Create redemption record
    const redemption = await RewardRedemption.create({
      user_id: req.user.id,
      reward_id: rewardId,
      points_used: reward.points_required,
      payment_details,
      status: 'pending',
      admin_notes: null
    });
    
    // Log activity
    await UserActivity.create({
      user_id: req.user.id,
      activity_type: 'reward_redeemed',
      points_change: -reward.points_required,
      description: `Redeemed reward: ${reward.name}`,
      ip_address: req.ip
    });
    
    res.status(200).json({
      message: 'Reward redemption successful',
      redemption: {
        id: redemption.id,
        status: redemption.status,
        created_at: redemption.created_at
      },
      new_balance: user.points_balance - reward.points_required
    });
  } catch (error) {
    console.error('Redeem reward error:', error);
    res.status(500).json({ message: 'Server error while redeeming reward' });
  }
};

/**
 * Get redemption history for current user
 * @route GET /api/rewards/history
 */
exports.getRedemptionHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Optional status filter
    const status = req.query.status;
    
    const whereClause = {
      user_id: req.user.id
    };
    console.log(req.user.id);
    if (status) {
      whereClause.status = status;
    }
    
    const redemptions = await RewardRedemption.findAndCountAll({
      where: whereClause,
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
    
    const totalPages = Math.ceil(redemptions.count / limit);
    
    res.status(200).json({
      redemptions: redemptions.rows,
      pagination: {
        total: redemptions.count,
        totalPages,
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error('Get redemption history error:', error);
    res.status(500).json({ message: 'Server error while fetching redemption history' });
  }
};

/**
 * Check redemption status
 * @route GET /api/rewards/redemptions/:id
 */
exports.checkRedemptionStatus = async (req, res) => {
  try {
    const redemptionId = req.params.id;
    
    const redemption = await RewardRedemption.findOne({
      where: {
        id: redemptionId,
        user_id: req.user.id
      },
      include: [
        {
          model: RewardOption,
          attributes: ['id', 'name', 'points_required', 'image_url']
        }
      ]
    });
    
    if (!redemption) {
      return res.status(404).json({ message: 'Redemption not found' });
    }
    
    res.status(200).json({ redemption });
  } catch (error) {
    console.error('Check redemption status error:', error);
    res.status(500).json({ message: 'Server error while checking redemption status' });
  }
};

/**
 * Get reward categories
 * @route GET /api/rewards/categories
 */
exports.getRewardCategories = async (req, res) => {
  try {
    // Get distinct categories
    const categoriesResult = await RewardOption.findAll({
      attributes: ['category'],
      where: {
        category: {
          [Op.ne]: null
        },
        status: true
      },
      group: ['category']
    });
    
    const categories = categoriesResult.map(result => result.category);
    
    res.status(200).json({ categories });
  } catch (error) {
    console.error('Get reward categories error:', error);
    res.status(500).json({ message: 'Server error while fetching reward categories' });
  }
}; 
const { 
  Referral, 
  User, 
  UserActivity,
  SystemSetting
} = require('../models');
const { Op } = require('sequelize');

/**
 * Get referral program info
 * @route GET /api/referrals/info
 */
exports.getReferralInfo = async (req, res) => {
  try {
    // Get referral settings from system settings
    const settings = await SystemSetting.findAll({
      where: {
        key: {
          [Op.like]: 'referral_%'
        }
      }
    });

    // Convert to key-value object
    const referralSettings = settings.reduce((obj, setting) => {
      const key = setting.key.replace('referral_', '');
      obj[key] = setting.value;
      return obj;
    }, {});

    // Get user's referral code and stats
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'referral_code']
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Count referrals
    const totalReferrals = await Referral.count({
      where: { referrer_id: req.user.id }
    });

    // Calculate total earnings from referrals
    const totalEarnings = await Referral.sum('points_earned', {
      where: { referrer_id: req.user.id }
    }) || 0;

    // Generate referral link
    const referralLink = `${process.env.FRONTEND_URL || 'https://futurecash.app'}/register?ref=${user.referral_code}`;

    // Return combined info
    res.status(200).json({
      referral_code: user.referral_code,
      referral_link: referralLink,
      total_referrals: totalReferrals,
      total_earnings: totalEarnings,
      program_info: {
        points_per_referral: referralSettings.points_per_referral || '100',
        min_activity_required: referralSettings.min_activity_required || 'true',
        points_per_offer: referralSettings.points_per_offer || '10'
      }
    });
  } catch (error) {
    console.error('Get referral info error:', error);
    res.status(500).json({ message: 'Server error while fetching referral info' });
  }
};

/**
 * Get user's referrals
 * @route GET /api/referrals
 */
exports.getUserReferrals = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get referrals with basic user info
    const referrals = await Referral.findAndCountAll({
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
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    const totalPages = Math.ceil(referrals.count / limit);

    // Calculate total earnings from referrals
    const totalEarnings = await Referral.sum('points_earned', {
      where: { referrer_id: req.user.id }
    }) || 0;

    // Count active referrals
    const activeReferrals = await Referral.count({
      where: { 
        referrer_id: req.user.id,
        status: 'active'
      }
    });

    res.status(200).json({
      referrals: referrals.rows,
      stats: {
        total_referrals: referrals.count,
        active_referrals: activeReferrals,
        total_earnings: totalEarnings
      },
      pagination: {
        total: referrals.count,
        totalPages,
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error('Get user referrals error:', error);
    res.status(500).json({ message: 'Server error while fetching referrals' });
  }
};

/**
 * Get referral statistics
 * @route GET /api/referrals/stats
 */
exports.getReferralStats = async (req, res) => {
  try {
    // Get overall stats
    const totalReferrals = await Referral.count({
      where: { referrer_id: req.user.id }
    });

    const totalEarnings = await Referral.sum('points_earned', {
      where: { referrer_id: req.user.id }
    }) || 0;

    // Get monthly stats for chart
    const currentDate = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(currentDate.getMonth() - 6);

    const monthlyReferrals = await Referral.findAll({
      attributes: [
        [
          Referral.sequelize.fn('DATE_FORMAT', Referral.sequelize.col('created_at'), '%Y-%m'),
          'month'
        ],
        [
          Referral.sequelize.fn('COUNT', Referral.sequelize.col('id')),
          'count'
        ],
        [
          Referral.sequelize.fn('SUM', Referral.sequelize.col('points_earned')),
          'earnings'
        ]
      ],
      where: {
        referrer_id: req.user.id,
        created_at: {
          [Op.gte]: sixMonthsAgo
        }
      },
      group: [Referral.sequelize.fn('DATE_FORMAT', Referral.sequelize.col('created_at'), '%Y-%m')],
      order: [[Referral.sequelize.fn('DATE_FORMAT', Referral.sequelize.col('created_at'), '%Y-%m'), 'ASC']]
    });

    res.status(200).json({
      overall: {
        total_referrals: totalReferrals,
        total_earnings: totalEarnings
      },
      monthly_stats: monthlyReferrals
    });
  } catch (error) {
    console.error('Get referral stats error:', error);
    res.status(500).json({ message: 'Server error while fetching referral stats' });
  }
};

/**
 * Validate referral code
 * @route POST /api/referrals/validate
 */
exports.validateReferralCode = async (req, res) => {
  try {
    const { referral_code } = req.body;

    if (!referral_code) {
      return res.status(400).json({ message: 'Referral code is required' });
    }

    // Check if referral code exists
    const referrer = await User.findOne({
      where: { referral_code },
      attributes: ['id', 'email']
    });

    if (!referrer) {
      return res.status(404).json({
        valid: false,
        message: 'Invalid referral code'
      });
    }

    // Prevent self-referral
    if (req.user && referrer.id === req.user.id) {
      return res.status(400).json({
        valid: false,
        message: 'You cannot refer yourself'
      });
    }

    res.status(200).json({
      valid: true,
      message: 'Valid referral code',
      referrer_id: referrer.id
    });
  } catch (error) {
    console.error('Validate referral code error:', error);
    res.status(500).json({ message: 'Server error while validating referral code' });
  }
};

/**
 * Create a referral (for internal use)
 * Used by authController when a user registers with a referral code
 */
exports.createReferral = async (userId, referrerCode) => {
  try {
    // Find the referrer by code
    const referrer = await User.findOne({
      where: { referral_code: referrerCode }
    });

    if (!referrer) {
      throw new Error('Invalid referral code');
    }

    // Prevent self-referral
    if (referrer.id === userId) {
      throw new Error('Self-referral not allowed');
    }

    // Check if referral already exists
    const existingReferral = await Referral.findOne({
      where: {
        referrer_id: referrer.id,
        referred_id: userId
      }
    });

    if (existingReferral) {
      return existingReferral;
    }

    // Get referral points from system settings
    const pointsSetting = await SystemSetting.findOne({
      where: { key: 'referral_points_per_referral' }
    });

    const pointsPerReferral = pointsSetting ? parseInt(pointsSetting.value, 10) : 100;

    // Create new referral
    const referral = await Referral.create({
      referrer_id: referrer.id,
      referred_id: userId,
      status: 'active',
      points_earned: 0, // Initial points earned is 0
      ip_address: null
    });

    // Log activity for the referred user
    await UserActivity.create({
      user_id: userId,
      activity_type: 'referral_joined',
      description: `Joined using referral code from user ID ${referrer.id}`,
      points_change: 0
    });

    return referral;
  } catch (error) {
    console.error('Create referral error:', error);
    throw error;
  }
};

/**
 * Award referral points (for internal use)
 * Called when a referred user completes an offer or other qualifying action
 */
exports.awardReferralPoints = async (userId, pointsEarned, activityType) => {
  try {
    // Find the referral
    const referral = await Referral.findOne({
      where: {
        referred_id: userId,
        status: 'active'
      }
    });

    if (!referral) {
      // No referral found for this user
      return null;
    }

    // Get referral points percentage from system settings
    const percentageSetting = await SystemSetting.findOne({
      where: { key: 'referral_points_percentage' }
    });

    const pointsPercentage = percentageSetting ? parseFloat(percentageSetting.value) : 0.1; // Default 10%
    const referralPointsEarned = Math.floor(pointsEarned * pointsPercentage);

    if (referralPointsEarned <= 0) {
      return null;
    }

    // Update referral with new points
    await referral.update({
      points_earned: referral.points_earned + referralPointsEarned
    });

    // Update referrer's points balance
    const referrer = await User.findByPk(referral.referrer_id);
    
    if (referrer) {
      await referrer.update({
        points_balance: referrer.points_balance + referralPointsEarned
      });

      // Log activity for the referrer
      await UserActivity.create({
        user_id: referrer.id,
        activity_type: 'referral_commission',
        description: `Earned ${referralPointsEarned} points from referral ID ${userId} (${activityType})`,
        points_change: referralPointsEarned
      });
    }

    return {
      referral,
      pointsAwarded: referralPointsEarned
    };
  } catch (error) {
    console.error('Award referral points error:', error);
    throw error;
  }
}; 
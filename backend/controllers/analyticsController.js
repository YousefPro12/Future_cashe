const { 
  DailyStat, 
  User, 
  Offer, 
  Video, 
  OfferCompletion, 
  VideoView, 
  RewardRedemption 
} = require('../models');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

/**
 * Generate daily stats report (internal use)
 * Should be called by a scheduled job/cron
 */
exports.generateDailyStats = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if we already have stats for yesterday
    const existingStats = await DailyStat.findOne({
      where: {
        date: yesterday
      }
    });
    
    if (existingStats) {
      console.log(`Daily stats for ${yesterday.toISOString().split('T')[0]} already exist`);
      return existingStats;
    }
    
    // Calculate total users
    const totalUsers = await User.count();
    
    // Calculate new users registered yesterday
    const newUsers = await User.count({
      where: {
        created_at: {
          [Op.gte]: yesterday,
          [Op.lt]: today
        }
      }
    });
    
    // Calculate offer completions yesterday
    const offerCompletions = await OfferCompletion.count({
      where: {
        created_at: {
          [Op.gte]: yesterday,
          [Op.lt]: today
        }
      }
    });
    
    // Calculate video views yesterday
    const videoViews = await VideoView.count({
      where: {
        created_at: {
          [Op.gte]: yesterday,
          [Op.lt]: today
        },
        status: 'completed'
      }
    });
    
    // Calculate redemptions yesterday
    const redemptions = await RewardRedemption.count({
      where: {
        created_at: {
          [Op.gte]: yesterday,
          [Op.lt]: today
        }
      }
    });
    
    // Calculate points earned yesterday
    const pointsEarned = await sequelize.literal(`(
      SELECT COALESCE(SUM(points_change), 0)
      FROM user_activities
      WHERE created_at >= '${yesterday.toISOString()}'
      AND created_at < '${today.toISOString()}'
      AND points_change > 0
    )`);
    
    // Calculate points spent yesterday
    const pointsSpent = await sequelize.literal(`(
      SELECT COALESCE(SUM(ABS(points_change)), 0)
      FROM user_activities
      WHERE created_at >= '${yesterday.toISOString()}'
      AND created_at < '${today.toISOString()}'
      AND points_change < 0
    )`);
    
    // Create daily stat record
    const dailyStat = await DailyStat.create({
      date: yesterday,
      total_users: totalUsers,
      new_users: newUsers,
      offer_completions: offerCompletions,
      video_views: videoViews,
      redemptions: redemptions,
      points_earned: pointsEarned,
      points_spent: pointsSpent
    });
    
    console.log(`Generated daily stats for ${yesterday.toISOString().split('T')[0]}`);
    return dailyStat;
  } catch (error) {
    console.error('Generate daily stats error:', error);
    throw error;
  }
};

/**
 * Get daily stats for a date range (admin only)
 * @route GET /api/admin/analytics/daily
 */
exports.getDailyStats = async (req, res) => {
  try {
    const startDate = req.query.start_date 
      ? new Date(req.query.start_date) 
      : new Date(new Date().setDate(new Date().getDate() - 30));
    
    const endDate = req.query.end_date 
      ? new Date(req.query.end_date) 
      : new Date();
    
    // Ensure dates are valid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }
    
    // Set time to ensure we get the full days
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    
    const dailyStats = await DailyStat.findAll({
      where: {
        date: {
          [Op.between]: [startDate, endDate]
        }
      },
      order: [['date', 'ASC']]
    });
    
    res.status(200).json({ daily_stats: dailyStats });
  } catch (error) {
    console.error('Get daily stats error:', error);
    res.status(500).json({ message: 'Server error while fetching daily stats' });
  }
};

/**
 * Get user retention analytics (admin only)
 * @route GET /api/admin/analytics/retention
 */
exports.getUserRetention = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - days);
    
    // Get new users per day
    const newUsers = await User.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        created_at: {
          [Op.gte]: startDate
        }
      },
      group: [sequelize.fn('DATE', sequelize.col('created_at'))],
      order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']]
    });
    
    // Get active users per day
    const activeUsers = await sequelize.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(DISTINCT user_id) as count
      FROM user_activities
      WHERE created_at >= :startDate
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `, {
      replacements: { startDate },
      type: sequelize.QueryTypes.SELECT
    });
    
    // Calculate retention rate
    const retentionData = [];
    
    // Loop through each day
    for (let i = 0; i < days; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];
      
      // Find new users for this date
      const newUsersForDate = newUsers.find(u => u.dataValues.date === dateStr);
      const newUsersCount = newUsersForDate ? parseInt(newUsersForDate.dataValues.count) : 0;
      
      // Find active users for this date
      const activeUsersForDate = activeUsers.find(u => u.date === dateStr);
      const activeUsersCount = activeUsersForDate ? parseInt(activeUsersForDate.count) : 0;
      
      // Calculate retention ratio
      const retentionRatio = newUsersCount > 0 ? activeUsersCount / newUsersCount : 0;
      
      retentionData.push({
        date: dateStr,
        new_users: newUsersCount,
        active_users: activeUsersCount,
        retention_ratio: retentionRatio
      });
    }
    
    res.status(200).json({ retention_data: retentionData });
  } catch (error) {
    console.error('Get user retention error:', error);
    res.status(500).json({ message: 'Server error while fetching user retention' });
  }
};

/**
 * Get revenue analytics (admin only)
 * @route GET /api/admin/analytics/revenue
 */
exports.getRevenueAnalytics = async (req, res) => {
  try {
    const period = req.query.period || 'month';
    const today = new Date();
    let startDate, groupByFormat;
    
    // Set date range based on period
    switch (period) {
      case 'week':
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 7);
        groupByFormat = '%Y-%m-%d';
        break;
      case 'month':
        startDate = new Date(today);
        startDate.setMonth(startDate.getMonth() - 1);
        groupByFormat = '%Y-%m-%d';
        break;
      case 'year':
        startDate = new Date(today);
        startDate.setFullYear(startDate.getFullYear() - 1);
        groupByFormat = '%Y-%m';
        break;
      default:
        startDate = new Date(today);
        startDate.setMonth(startDate.getMonth() - 1);
        groupByFormat = '%Y-%m-%d';
    }
    
    startDate.setHours(0, 0, 0, 0);
    
    // Get offer completions by date
    const offerRevenue = await OfferCompletion.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), groupByFormat), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('points')), 'points']
      ],
      where: {
        created_at: {
          [Op.gte]: startDate
        },
        status: 'approved'
      },
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), groupByFormat)],
      order: [[sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), groupByFormat), 'ASC']]
    });
    
    // Get video views by date
    const videoRevenue = await VideoView.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), groupByFormat), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('points')), 'points']
      ],
      where: {
        created_at: {
          [Op.gte]: startDate
        },
        status: 'completed'
      },
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), groupByFormat)],
      order: [[sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), groupByFormat), 'ASC']]
    });
    
    // Get redemptions by date
    const redemptions = await RewardRedemption.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), groupByFormat), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('points_cost')), 'points']
      ],
      where: {
        created_at: {
          [Op.gte]: startDate
        }
      },
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), groupByFormat)],
      order: [[sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), groupByFormat), 'ASC']]
    });
    
    res.status(200).json({
      offer_revenue: offerRevenue,
      video_revenue: videoRevenue,
      redemptions: redemptions,
      period: period
    });
  } catch (error) {
    console.error('Get revenue analytics error:', error);
    res.status(500).json({ message: 'Server error while fetching revenue analytics' });
  }
};

/**
 * Get user engagement metrics (admin only)
 * @route GET /api/admin/analytics/engagement
 */
exports.getUserEngagement = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);
    
    // Get daily active users
    const dailyActiveUsers = await sequelize.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(DISTINCT user_id) as count
      FROM user_activities
      WHERE created_at >= :startDate
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `, {
      replacements: { startDate },
      type: sequelize.QueryTypes.SELECT
    });
    
    // Get average session length
    // This is a placeholder - in a real app, you'd track session start/end times
    const avgSessionLength = await sequelize.query(`
      SELECT 
        DATE(created_at) as date,
        AVG(60) as avg_seconds
      FROM user_activities
      WHERE created_at >= :startDate
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `, {
      replacements: { startDate },
      type: sequelize.QueryTypes.SELECT
    });
    
    // Get offer completion rate
    const offerClicksByDay = await sequelize.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as clicks
      FROM user_activities
      WHERE created_at >= :startDate
      AND activity_type = 'offer_click'
      GROUP BY DATE(created_at)
    `, {
      replacements: { startDate },
      type: sequelize.QueryTypes.SELECT
    });
    
    const offerCompletionsByDay = await sequelize.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as completions
      FROM offer_completions
      WHERE created_at >= :startDate
      GROUP BY DATE(created_at)
    `, {
      replacements: { startDate },
      type: sequelize.QueryTypes.SELECT
    });
    
    // Calculate completion rates
    const completionRates = [];
    for (const day of offerClicksByDay) {
      const completion = offerCompletionsByDay.find(c => c.date === day.date);
      const completions = completion ? completion.completions : 0;
      const rate = day.clicks > 0 ? completions / day.clicks : 0;
      
      completionRates.push({
        date: day.date,
        clicks: day.clicks,
        completions: completions,
        rate: rate
      });
    }
    
    res.status(200).json({
      daily_active_users: dailyActiveUsers,
      avg_session_length: avgSessionLength,
      offer_completion_rates: completionRates
    });
  } catch (error) {
    console.error('Get user engagement error:', error);
    res.status(500).json({ message: 'Server error while fetching user engagement' });
  }
}; 
const { 
  Video, 
  VideoView, 
  User, 
  UserActivity 
} = require('../models');
const { Op } = require('sequelize');
const userController = require('./userController');

/**
 * Get all available videos
 * @route GET /api/videos
 */
exports.getVideos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    // Get user's country if available (from request or user's saved location)
    const userCountry = req.query.country || 'US'; // Default to US if not provided
    
    // Build where clause based on user's country and video status
    const whereClause = {
      status: true,
    };
    
    // Get videos
    const videos = await Video.findAndCountAll({
      where: whereClause,
      attributes: [
        'id', 'title', 'description', 'video_url', 
        'thumbnail_url', 'points', 'watch_time_seconds',
        'external_link', 'countries'
      ],
      order: [
        ['points', 'DESC'],
        ['created_at', 'DESC']
      ],
      limit,
      offset
    });
    
    const totalPages = Math.ceil(videos.count / limit);
    
    // Get viewed video IDs for this user to mark as watched
    const viewedVideoIds = await getViewedVideoIds(req.user.id);
    
    // Filter videos by country and mark as watched for this user
    const formattedVideos = videos.rows
      .filter(video => {
        // If no countries specified, show to all
        if (!video.countries || video.countries.length === 0) {
          return true;
        }
        
        // Otherwise, only show to matching countries
        return video.countries.includes(userCountry);
      })
      .map(video => {
        const videoData = video.toJSON();
        videoData.watched = viewedVideoIds.includes(video.id);
        return videoData;
      });
    
    res.status(200).json({
      videos: formattedVideos,
      pagination: {
        total: formattedVideos.length,
        totalPages: Math.ceil(formattedVideos.length / limit),
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({ message: 'Server error while fetching videos' });
  }
};

/**
 * Get video details by ID
 * @route GET /api/videos/:id
 */
exports.getVideoById = async (req, res) => {
  try {
    const videoId = req.params.id;
    
    const video = await Video.findByPk(videoId);
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    // Check if user has watched this video
    const hasWatched = await VideoView.findOne({
      where: {
        user_id: req.user.id,
        video_id: videoId,
        status: 'completed'
      }
    });
    
    const videoData = video.toJSON();
    videoData.watched = !!hasWatched;
    
    res.status(200).json({ video: videoData });
  } catch (error) {
    console.error('Get video by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching video details' });
  }
};

/**
 * Start watching a video
 * @route POST /api/videos/:id/start
 */
exports.startWatchingVideo = async (req, res) => {
  try {
    const videoId = req.params.id;
    
    const video = await Video.findByPk(videoId);
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    // Check if video is already completed by this user
    const existingView = await VideoView.findOne({
      where: {
        user_id: req.user.id,
        video_id: videoId,
        status: 'completed'
      }
    });
    
    if (existingView) {
      return res.status(400).json({ 
        message: 'You have already watched this video',
        already_watched: true
      });
    }
    
    // Track user IP for fraud prevention
    await userController.trackUserIp(req, req.user.id);
    
    // Log activity
    await UserActivity.create({
      user_id: req.user.id,
      activity_type: 'video_start',
      description: `Started watching video: ${video.title}`,
      ip_address: req.ip
    });
    
    res.status(200).json({ 
      message: 'Video watch started',
      watch_time_required: video.watch_time_seconds,
      points: video.points
    });
  } catch (error) {
    console.error('Start watching video error:', error);
    res.status(500).json({ message: 'Server error while starting video watch' });
  }
};

/**
 * Complete watching a video
 * @route POST /api/videos/:id/complete
 */
exports.completeWatchingVideo = async (req, res) => {
  try {
    const videoId = req.params.id;
    const { watch_time_seconds } = req.body;
    
    const video = await Video.findByPk(videoId);
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    // Check if video is already completed by this user
    const existingView = await VideoView.findOne({
      where: {
        user_id: req.user.id,
        video_id: videoId,
        status: 'completed'
      }
    });
    
    if (existingView) {
      return res.status(400).json({ 
        message: 'You have already watched this video',
        already_watched: true
      });
    }
    
    // Verify watch time
    if (!watch_time_seconds || watch_time_seconds < video.watch_time_seconds) {
      // Create a partial view record
      await VideoView.create({
        user_id: req.user.id,
        video_id: videoId,
        points_awarded: 0, // No points for partial watch
        watch_time_seconds: watch_time_seconds || 0,
        status: 'partial',
        ip_address: req.ip
      });
      
      return res.status(400).json({ 
        message: 'Watch time is insufficient',
        watch_time_required: video.watch_time_seconds,
        watch_time_provided: watch_time_seconds || 0
      });
    }
    
    // Get user
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Create video view record
    await VideoView.create({
      user_id: req.user.id,
      video_id: videoId,
      points_awarded: video.points,
      watch_time_seconds: watch_time_seconds,
      status: 'completed',
      ip_address: req.ip
    });
    
    // Update user's points balance
    await user.update({
      points_balance: user.points_balance + video.points
    });
    
    // Log activity
    await UserActivity.create({
      user_id: req.user.id,
      activity_type: 'video_completed',
      points_change: video.points,
      description: `Completed watching video: ${video.title}`,
      ip_address: req.ip
    });
    
    res.status(200).json({ 
      message: 'Video watch completed',
      points_earned: video.points,
      new_balance: user.points_balance + video.points
    });
  } catch (error) {
    console.error('Complete watching video error:', error);
    res.status(500).json({ message: 'Server error while completing video watch' });
  }
};

/**
 * Get video view history for current user
 * @route GET /api/videos/history
 */
exports.getVideoHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Optional status filter
    const status = req.query.status;
    
    const whereClause = {
      user_id: req.user.id
    };
    
    if (status) {
      whereClause.status = status;
    }
    
    const views = await VideoView.findAndCountAll({
      where: whereClause,
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
    
    const totalPages = Math.ceil(views.count / limit);
    
    res.status(200).json({
      views: views.rows,
      pagination: {
        total: views.count,
        totalPages,
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error('Get video history error:', error);
    res.status(500).json({ message: 'Server error while fetching video history' });
  }
};

/**
 * Helper function to get viewed video IDs for a user
 * @param {number} userId - The user ID
 * @returns {Promise<Array>} Array of video IDs
 */
async function getViewedVideoIds(userId) {
  try {
    const completedViews = await VideoView.findAll({
      where: {
        user_id: userId,
        status: 'completed'
      },
      attributes: ['video_id']
    });
    
    return completedViews.map(view => view.video_id);
  } catch (error) {
    console.error('Get viewed video IDs error:', error);
    return [];
  }
} 
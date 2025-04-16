const { 
  Offer, 
  OfferWall, 
  OfferCompletion, 
  User, 
  UserActivity 
} = require('../models');
const { Op } = require('sequelize');
const userController = require('./userController');

/**
 * Get all available offers
 * @route GET /api/offers
 */
exports.getOffers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    // Optional filters
    const { category, offerWallId, minPoints, maxPoints, search } = req.query;
    
    // Build where clause based on filters
    const whereClause = {
      status: true
    };
    
    // Apply category filter if provided
    if (category) {
      whereClause.category = category;
    }
    
    // Apply offer wall filter if provided
    if (offerWallId) {
      whereClause.offer_wall_id = offerWallId;
    }
    
    // Apply points range filter if provided
    if (minPoints || maxPoints) {
      whereClause.points = {};
      if (minPoints) whereClause.points[Op.gte] = minPoints;
      if (maxPoints) whereClause.points[Op.lte] = maxPoints;
    }
    
    // Apply search filter if provided
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }
    
    // Get offers with offer wall information
    const offers = await Offer.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: OfferWall,
          attributes: ['id', 'name', 'image_url']
        }
      ],
      order: [
        ['points', 'DESC'],
        ['created_at', 'DESC']
      ],
      limit,
      offset
    });
    
    const totalPages = Math.ceil(offers.count / limit);
    
    // Get completed offer IDs for this user to mark as completed
    const completedOfferIds = await getCompletedOfferIds(req.user.id);
    
    // Mark offers as completed for this user
    const formattedOffers = offers.rows.map(offer => {
      const offerData = offer.toJSON();
      offerData.completed = completedOfferIds.includes(offer.id);
      return offerData;
    });
    
    res.status(200).json({
      offers: formattedOffers,
      pagination: {
        total: offers.count,
        totalPages,
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error('Get offers error:', error);
    res.status(500).json({ message: 'Server error while fetching offers' });
  }
};

/**
 * Get offer details by ID
 * @route GET /api/offers/:id
 */
exports.getOfferById = async (req, res) => {
  try {
    const offerId = req.params.id;
    
    const offer = await Offer.findByPk(offerId, {
      include: [
        {
          model: OfferWall,
          attributes: ['id', 'name', 'image_url']
        }
      ]
    });
    
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    
    // Check if user has completed this offer
    const isCompleted = await OfferCompletion.findOne({
      where: {
        user_id: req.user.id,
        offer_id: offerId
      }
    });
    
    const offerData = offer.toJSON();
    offerData.completed = !!isCompleted;
    
    res.status(200).json({ offer: offerData });
  } catch (error) {
    console.error('Get offer by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching offer details' });
  }
};

/**
 * Get all offer walls
 * @route GET /api/offers/providers
 */
exports.getOfferWalls = async (req, res) => {
  try {
    const offerWalls = await OfferWall.findAll({
      where: {
        status: true
      },
      attributes: ['id', 'name', 'image_url', 'description']
    });
    
    res.status(200).json({ offerWalls });
  } catch (error) {
    console.error('Get offer walls error:', error);
    res.status(500).json({ message: 'Server error while fetching offer walls' });
  }
};

/**
 * Track offer click (before redirect)
 * @route POST /api/offers/:id/click
 */
exports.trackOfferClick = async (req, res) => {
  try {
    const offerId = req.params.id;
    
    const offer = await Offer.findByPk(offerId);
    
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    
    // Generate tracking URL (can be extended with actual offer wall API integration)
    const trackingUrl = generateTrackingUrl(offer, req.user.id);
    
    // Track user IP for fraud prevention
    await userController.trackUserIp(req, req.user.id);
    
    // Log activity
    await UserActivity.create({
      user_id: req.user.id,
      activity_type: 'offer_click',
      description: `Clicked on offer: ${offer.title}`,
      ip_address: req.ip
    });
    
    res.status(200).json({ 
      trackingUrl,
      message: 'Offer click tracked successfully' 
    });
  } catch (error) {
    console.error('Track offer click error:', error);
    res.status(500).json({ message: 'Server error while tracking offer click' });
  }
};

/**
 * Mark offer as complete (callback from provider)
 * This is a public endpoint used by offer wall providers
 * @route POST /api/offers/callback
 */
exports.offerCallback = async (req, res) => {
  try {
    // Extract parameters (will vary based on provider)
    const { 
      transaction_id, 
      user_id, 
      offer_id, 
      offer_name,
      points, 
      provider, 
      ip_address, 
      signature
    } = req.body;
    
    // Validate the callback (implementation depends on provider)
    const isValid = await validateCallback(req.body, provider);
    
    if (!isValid) {
      return res.status(403).json({ message: 'Invalid callback signature' });
    }
    
    // Find the offer by external ID and provider
    const offer = await Offer.findOne({
      include: [
        {
          model: OfferWall,
          where: { name: provider }
        }
      ],
      where: { external_offer_id: offer_id }
    });
    
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    
    // Find user
    const user = await User.findByPk(user_id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check for duplicate transaction
    const existingTransaction = await OfferCompletion.findOne({
      where: { transaction_id }
    });
    
    if (existingTransaction) {
      return res.status(200).json({ message: 'Transaction already processed' });
    }
    
    // Check if this is a chargeback/reversal
    const isChargeback = points < 0;
    
    // For chargeback, find existing completion and mark as rejected
    if (isChargeback && transaction_id) {
      const originalCompletion = await OfferCompletion.findOne({
        where: { 
          user_id,
          offer_id: offer.id,
          status: 'approved'
        }
      });
      
      if (originalCompletion) {
        // Reverse the points awarded
        await user.update({
          points_balance: user.points_balance + points // points is negative for chargebacks
        });
        
        // Update completion status
        await originalCompletion.update({
          status: 'rejected'
        });
        
        // Log activity
        await UserActivity.create({
          user_id,
          activity_type: 'offer_chargeback',
          points_change: points,
          description: `Chargeback for offer: ${offer.title}`,
          ip_address
        });
        
        return res.status(200).json({ message: 'Chargeback processed successfully' });
      }
    }
    
    // Determine if offer should be held (anti-fraud measure)
    const shouldHoldOffer = await shouldHold(user.id, offer.id, ip_address);
    const status = shouldHoldOffer ? 'held' : 'approved';
    
    // Calculate hold time if needed
    const heldUntil = shouldHoldOffer ? 
      new Date(Date.now() + (24 * 60 * 60 * 1000)) : // Hold for 24 hours 
      null;
    
    // Create completion record
    const completion = await OfferCompletion.create({
      user_id,
      offer_id: offer.id,
      transaction_id,
      points_awarded: offer.points,
      status,
      ip_address,
      completion_time: new Date(),
      held_until: heldUntil
    });
    
    // If not held, award points immediately
    if (status === 'approved') {
      // Update user's points balance
      await user.update({
        points_balance: user.points_balance + offer.points
      });
      
      // Log activity
      await UserActivity.create({
        user_id,
        activity_type: 'offer_completed',
        points_change: offer.points,
        description: `Completed offer: ${offer.title}`,
        ip_address
      });
    } else {
      // Log hold activity
      await UserActivity.create({
        user_id,
        activity_type: 'offer_held',
        description: `Offer held for review: ${offer.title}`,
        ip_address
      });
    }
    
    res.status(200).json({ 
      message: status === 'approved' ? 
        'Offer completed successfully' : 
        'Offer placed on hold for review'
    });
  } catch (error) {
    console.error('Offer callback error:', error);
    res.status(500).json({ message: 'Server error while processing offer completion' });
  }
};

/**
 * Get offer completion history for current user
 * @route GET /api/offers/history
 */
exports.getOfferHistory = async (req, res) => {
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
    
    const completions = await OfferCompletion.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Offer,
          attributes: ['id', 'title', 'points', 'image_url'],
          include: [
            {
              model: OfferWall,
              attributes: ['id', 'name']
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });
    
    const totalPages = Math.ceil(completions.count / limit);
    
    res.status(200).json({
      completions: completions.rows,
      pagination: {
        total: completions.count,
        totalPages,
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error('Get offer history error:', error);
    res.status(500).json({ message: 'Server error while fetching offer history' });
  }
};

/**
 * Process held offers that have passed the hold period
 * This would typically be run by a cron job
 */
exports.processHeldOffers = async () => {
  try {
    // Find all held offers that have passed their hold time
    const heldOffers = await OfferCompletion.findAll({
      where: {
        status: 'held',
        held_until: {
          [Op.lt]: new Date()
        }
      },
      include: [
        {
          model: Offer,
          attributes: ['id', 'title', 'points']
        },
        {
          model: User,
          attributes: ['id', 'points_balance']
        }
      ]
    });
    
    console.log(`Processing ${heldOffers.length} held offers`);
    
    // Process each held offer
    for (const completion of heldOffers) {
      // Update completion status
      await completion.update({
        status: 'approved'
      });
      
      // Award points to user
      await completion.User.update({
        points_balance: completion.User.points_balance + completion.Offer.points
      });
      
      // Log activity
      await UserActivity.create({
        user_id: completion.user_id,
        activity_type: 'offer_approved',
        points_change: completion.Offer.points,
        description: `Held offer approved: ${completion.Offer.title}`
      });
    }
    
    return heldOffers.length;
  } catch (error) {
    console.error('Process held offers error:', error);
    return 0;
  }
};

/**
 * Helper function to get completed offer IDs for a user
 * @param {number} userId - The user ID
 * @returns {Promise<Array>} Array of offer IDs
 */
async function getCompletedOfferIds(userId) {
  try {
    const completions = await OfferCompletion.findAll({
      where: {
        user_id: userId,
        status: {
          [Op.in]: ['approved', 'held']
        }
      },
      attributes: ['offer_id']
    });
    
    return completions.map(completion => completion.offer_id);
  } catch (error) {
    console.error('Get completed offer IDs error:', error);
    return [];
  }
}

/**
 * Helper function to generate tracking URL for offers
 * @param {Object} offer - The offer object
 * @param {number} userId - The user ID
 * @returns {string} Tracking URL
 */
function generateTrackingUrl(offer, userId) {
  // This is a placeholder - in a real implementation, 
  // you would integrate with the offer wall's API
  const baseUrl = offer.offer_url || '';
  
  if (!baseUrl) {
    return '';
  }
  
  // Add tracking parameters
  const url = new URL(baseUrl);
  url.searchParams.append('user_id', userId);
  url.searchParams.append('sub_id', userId);
  
  return url.toString();
}

/**
 * Helper function to validate callbacks from offer providers
 * @param {Object} payload - The callback payload
 * @param {string} provider - The provider name
 * @returns {Promise<boolean>} Whether the callback is valid
 */
async function validateCallback(payload, provider) {
  // This is a placeholder - in a real implementation,
  // you would verify the callback signature based on the provider's documentation
  
  // For now, we'll just return true
  return true;
}

/**
 * Helper function to determine if an offer should be held for review
 * @param {number} userId - The user ID
 * @param {number} offerId - The offer ID
 * @param {string} ipAddress - The IP address
 * @returns {Promise<boolean>} Whether the offer should be held
 */
async function shouldHold(userId, offerId, ipAddress) {
  try {
    // Check for new accounts (less than 24 hours old)
    const user = await User.findByPk(userId);
    
    if (!user) {
      return true; // Hold if user not found (shouldn't happen)
    }
    
    const accountAgeDays = (Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24);
    
    if (accountAgeDays < 1) {
      return true; // Hold for new accounts
    }
    
    // Check for multiple completions from same IP in last 24 hours
    const recentCompletions = await OfferCompletion.count({
      where: {
        ip_address: ipAddress,
        created_at: {
          [Op.gte]: new Date(Date.now() - (24 * 60 * 60 * 1000))
        }
      }
    });
    
    if (recentCompletions >= 10) {
      return true; // Hold if too many completions from same IP
    }
    
    // Check for high value offers
    const offer = await Offer.findByPk(offerId);
    
    if (offer && offer.points >= 5000) {
      return true; // Hold high-value offers
    }
    
    return false; // Don't hold if no flags triggered
  } catch (error) {
    console.error('Should hold error:', error);
    return true; // Hold on error to be safe
  }
} 
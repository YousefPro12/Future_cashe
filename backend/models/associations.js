/**
 * Define all model associations in one place
 * This helps avoid circular dependencies
 */
const setupAssociations = (models) => {
  // Destructure models, with default empty objects for missing models
  const {
    User = {},
    AuthSession = {},
    OtpCode = {},
    UserActivity = {},
    UserIpHistory = {},
    Referral = {},
    OfferWall = {},
    Offer = {},
    OfferCompletion = {},
    Video = {},
    VideoView = {},
    RewardOption = {},
    RewardRedemption = {},
    ChatMessage = {},
    Admin = {},
    AdminActivityLog = {},
    IpWhitelist = {},
    SystemSetting = {},
    DailyStat = {}
  } = models;

  // Helper function to check if a model is valid before setting up associations
  const associate = (sourceModel, associationType, targetModel, options) => {
    if (!sourceModel.associate) {
      console.warn(`Model ${sourceModel.name || 'unknown'} is not properly initialized or doesn't have associations`);
      return;
    }
    
    if (associationType === 'hasMany') {
      if (targetModel && typeof targetModel === 'object') {
        sourceModel.hasMany(targetModel, options);
      } else {
        console.warn(`Target model is invalid for hasMany association from ${sourceModel.name || 'unknown'}`);
      }
    } else if (associationType === 'belongsTo') {
      if (targetModel && typeof targetModel === 'object') {
        sourceModel.belongsTo(targetModel, options);
      } else {
        console.warn(`Target model is invalid for belongsTo association from ${sourceModel.name || 'unknown'}`);
      }
    }
  };

  // User associations
  if (User.name) {
    if (AuthSession.name) User.hasMany(AuthSession, { foreignKey: 'user_id', as: 'authSessions' });
    if (OtpCode.name) User.hasMany(OtpCode, { foreignKey: 'user_id', as: 'otpCodes' });
    if (UserActivity.name) User.hasMany(UserActivity, { foreignKey: 'user_id', as: 'activities' });
    if (UserIpHistory.name) User.hasMany(UserIpHistory, { foreignKey: 'user_id', as: 'ipHistory' });
    if (ChatMessage.name) User.hasMany(ChatMessage, { foreignKey: 'user_id', as: 'chatMessages' });
    if (OfferCompletion.name) User.hasMany(OfferCompletion, { foreignKey: 'user_id', as: 'offerCompletions' });
    if (VideoView.name) User.hasMany(VideoView, { foreignKey: 'user_id', as: 'videoViews' });
    if (RewardRedemption.name) User.hasMany(RewardRedemption, { foreignKey: 'user_id', as: 'redemptions' });
    
    // Referral associations (both sides of the relationship)
    if (Referral.name) {
      User.hasMany(Referral, { foreignKey: 'referrer_id', as: 'referrals' });
      User.hasMany(Referral, { foreignKey: 'referred_id', as: 'referredBy' });
    }
  }
  
  // Referral associations
  if (Referral.name && User.name) {
    Referral.belongsTo(User, { foreignKey: 'referrer_id', as: 'referrer' });
    Referral.belongsTo(User, { foreignKey: 'referred_id', as: 'referred' });
  }

  // Auth sessions
  if (AuthSession.name && User.name) {
    AuthSession.belongsTo(User, { foreignKey: 'user_id' });
  }

  // OTP codes
  if (OtpCode.name && User.name) {
    OtpCode.belongsTo(User, { foreignKey: 'user_id' });
  }

  // User activities
  if (UserActivity.name && User.name) {
    UserActivity.belongsTo(User, { foreignKey: 'user_id' });
  }

  // User IP history
  if (UserIpHistory.name && User.name) {
    UserIpHistory.belongsTo(User, { foreignKey: 'user_id' });
  }

  // Offer wall associations
  if (OfferWall.name && Offer.name) {
    OfferWall.hasMany(Offer, { foreignKey: 'offer_wall_id', as: 'offers' });
    Offer.belongsTo(OfferWall, { foreignKey: 'offer_wall_id' });
  }

  // Offer completion associations
  if (Offer.name && OfferCompletion.name && User.name) {
    Offer.hasMany(OfferCompletion, { foreignKey: 'offer_id', as: 'completions' });
    OfferCompletion.belongsTo(Offer, { foreignKey: 'offer_id' });
    OfferCompletion.belongsTo(User, { foreignKey: 'user_id' });
  }

  // Video view associations
  if (Video.name && VideoView.name && User.name) {
    Video.hasMany(VideoView, { foreignKey: 'video_id', as: 'views' });
    VideoView.belongsTo(Video, { foreignKey: 'video_id' });
    VideoView.belongsTo(User, { foreignKey: 'user_id' });
  }

  // Reward redemption associations
  if (RewardOption.name && RewardRedemption.name && User.name) {
    RewardOption.hasMany(RewardRedemption, { foreignKey: 'reward_id', as: 'redemptions' });
    RewardRedemption.belongsTo(RewardOption, { foreignKey: 'reward_id' });
    RewardRedemption.belongsTo(User, { foreignKey: 'user_id' });
  }

  // Chat message associations
  if (ChatMessage.name && User.name) {
    ChatMessage.belongsTo(User, { foreignKey: 'user_id' });
  }

  // Admin activity associations
  if (Admin.name && AdminActivityLog.name) {
    Admin.hasMany(AdminActivityLog, { foreignKey: 'admin_id', as: 'activities' });
    AdminActivityLog.belongsTo(Admin, { foreignKey: 'admin_id' });
  }
};

module.exports = setupAssociations;
const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    fullname: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    account_status: {
      type: DataTypes.ENUM('active', 'suspended', 'banned'),
      defaultValue: 'active',
      allowNull: false
    },
    points_balance: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      allowNull: false
    },
    referral_code: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true
    },
    referred_by: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeCreate: async (user) => {
        // Generate a unique referral code if not provided
        if (!user.referral_code) {
          user.referral_code = uuidv4().substring(0, 8);
        }
        
        // Hash the password before saving
        if (user.password_hash) {
          const salt = await bcrypt.genSalt(10);
          user.password_hash = await bcrypt.hash(user.password_hash, salt);
        }
      }
    }
  });

  // Instance method to validate password
  User.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password_hash);
  };

  // Associate models when other models are defined
  User.associate = (models) => {
    // A user can refer many other users
    User.hasMany(models.User, {
      foreignKey: 'referred_by',
      as: 'referrals'
    });

    // A user can be referred by another user
    User.belongsTo(models.User, {
      foreignKey: 'referred_by',
      as: 'referrer'
    });

    // Will add other associations as other models are created:
    // - User has many UserActivities
    // - User has many OfferCompletions
    // - User has many VideoViews
    // - User has many RewardRedemptions
    // - User has many ChatMessages
  };

  return User;
};
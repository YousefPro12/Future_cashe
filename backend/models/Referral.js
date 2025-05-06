const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Referral = sequelize.define('Referral', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    referrer_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    referred_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    points_earned: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    status: {
      type: DataTypes.ENUM('pending', 'active', 'paid'),
      allowNull: false,
      defaultValue: 'pending'
    }
  }, {
    tableName: 'referrals',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Referral.associate = (models) => {
    Referral.belongsTo(models.User, {
      foreignKey: 'referrer_id',
      as: 'referrer'
    });
    Referral.belongsTo(models.User, {
      foreignKey: 'referred_id',
      as: 'referred'
    });
  };

  return Referral;
};
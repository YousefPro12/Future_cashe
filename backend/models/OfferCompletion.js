const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OfferCompletion = sequelize.define('OfferCompletion', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    offer_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'offers',
        key: 'id'
      }
    },
    transaction_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true
    },
    points_awarded: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'held'),
      allowNull: false,
      defaultValue: 'pending'
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    completion_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    held_until: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'offer_completions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return OfferCompletion;
};
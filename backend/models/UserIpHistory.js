const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserIpHistory = sequelize.define('UserIpHistory', {
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
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    user_agent: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    country: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    region: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    tableName: 'user_ip_history',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      {
        fields: ['ip_address']
      }
    ]
  });

  return UserIpHistory;
};
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const IpWhitelist = sequelize.define('IpWhitelist', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'ip_whitelist',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  return IpWhitelist;
}; 
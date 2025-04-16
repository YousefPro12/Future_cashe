const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AdminActivityLog = sequelize.define('AdminActivityLog', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    admin_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'admins',
        key: 'id'
      }
    },
    action: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    tableName: 'admin_activity_log',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  return AdminActivityLog;
};
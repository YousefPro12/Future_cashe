const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OtpCode = sequelize.define('OtpCode', {
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
    code: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    purpose: {
      type: DataTypes.ENUM('login', 'password_reset', 'email_verify'),
      allowNull: false
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    used: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    tableName: 'otp_codes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  return OtpCode;
};
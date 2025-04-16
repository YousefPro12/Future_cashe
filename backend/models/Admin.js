const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const Admin = sequelize.define('Admin', {
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
    role: {
      type: DataTypes.ENUM('admin', 'super_admin'),
      allowNull: false,
      defaultValue: 'admin'
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'admins',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeCreate: async (admin) => {
        if (admin.password_hash) {
          const salt = await bcrypt.genSalt(10);
          admin.password_hash = await bcrypt.hash(admin.password_hash, salt);
        }
      },
      beforeUpdate: async (admin) => {
        // Only hash the password if it was changed
        if (admin.changed('password_hash') && admin.password_hash) {
          const salt = await bcrypt.genSalt(10);
          admin.password_hash = await bcrypt.hash(admin.password_hash, salt);
        }
      }
    }
  });

  // Instance method to validate password
  Admin.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password_hash);
  };

  // Method to update last login
  Admin.prototype.updateLoginTimestamp = async function() {
    this.last_login = new Date();
    return await this.save();
  };

  return Admin;
};
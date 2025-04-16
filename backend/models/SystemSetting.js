const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SystemSetting = sequelize.define('SystemSetting', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    setting_key: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    setting_value: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const type = this.getDataValue('setting_type');
        const value = this.getDataValue('setting_value');
        
        if (!value) return null;
        
        switch (type) {
          case 'number':
            return parseFloat(value);
          case 'boolean':
            return value === 'true' || value === '1';
          case 'json':
            try {
              return JSON.parse(value);
            } catch (e) {
              return value;
            }
          default:
            return value;
        }
      },
      set(value) {
        const type = this.getDataValue('setting_type');
        
        if (value === null || value === undefined) {
          this.setDataValue('setting_value', null);
          return;
        }
        
        switch (type) {
          case 'json':
            this.setDataValue('setting_value', JSON.stringify(value));
            break;
          default:
            this.setDataValue('setting_value', String(value));
        }
      }
    },
    setting_type: {
      type: DataTypes.ENUM('string', 'number', 'boolean', 'json'),
      allowNull: false,
      defaultValue: 'string'
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'system_settings',
    timestamps: true,
    createdAt: false,
    updatedAt: 'updated_at'
  });

  return SystemSetting;
};
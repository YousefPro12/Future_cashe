const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Offer = sequelize.define('Offer', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    offer_wall_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'offer_walls',
        key: 'id'
      }
    },
    external_offer_id: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    points: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    offer_url: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    countries: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue('countries');
        return value ? JSON.parse(value) : [];
      },
      set(value) {
        this.setDataValue('countries', JSON.stringify(value));
      }
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    tableName: 'offers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['offer_wall_id', 'external_offer_id']
      }
    ]
  });

  return Offer;
};
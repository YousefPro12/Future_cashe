const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OfferWall = sequelize.define('OfferWall', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    api_key: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    api_secret: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    base_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'offer_walls',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return OfferWall;
};
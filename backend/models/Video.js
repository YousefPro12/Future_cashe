const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Video = sequelize.define('Video', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
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
    video_url: {
      type: DataTypes.STRING(512),
      allowNull: false
    },
    thumbnail_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    points: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    watch_time_seconds: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    external_link: {
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
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    tableName: 'videos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Video;
};
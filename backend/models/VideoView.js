const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const VideoView = sequelize.define('VideoView', {
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
    video_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'videos',
        key: 'id'
      }
    },
    points_awarded: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    watch_time_seconds: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('completed', 'partial'),
      allowNull: false
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    tableName: 'video_views',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  return VideoView;
}; 
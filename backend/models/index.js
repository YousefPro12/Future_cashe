const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
require('dotenv').config();
const setupAssociations = require('./associations');

// Database configuration
const config = {
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'future_cash',
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

// Initialize Sequelize
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: config.logging,
    pool: config.pool,
    define: {
      // Set the default timestamp fields
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

// Initialize models container
const db = {};

// Read all model files and import them
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== 'index.js' &&
      file !== 'associations.js' && // Exclude the associations file
      file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    try {
      const model = require(path.join(__dirname, file))(sequelize);
      if (model) {
        db[model.name] = model;
      } else {
        console.warn(`Model from file ${file} is undefined`);
      }
    } catch (error) {
      console.error(`Error loading model from file ${file}:`, error.message);
    }
  });

// Set up model associations from the associations file
try {
  if (Object.keys(db).length > 0) {
    setupAssociations(db);
  } else {
    console.error('No models loaded before setting up associations');
  }
} catch (error) {
  console.error('Error setting up associations:', error.message);
}

// Add database connection to the db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
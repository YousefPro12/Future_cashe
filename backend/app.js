// app.js
const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

// Import database models
const db = require('./models');

// Import middleware
const { authenticateToken } = require('./middleware/auth');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const rewardRoutes = require('./routes/rewardRoutes');
const videoRoutes = require('./routes/videoRoutes');
const offerRoutes = require('./routes/offerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const chatRoutes = require('./routes/chatRoutes');
const referralRoutes = require('./routes/referralRoutes');

// Import scheduler
const { initScheduler } = require('./scheduler');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection
async function testConnection() {
  try {
    await db.sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection();

// Sync database models in development (not recommended for production)
if (process.env.NODE_ENV === 'development') {
  db.sequelize.sync({ alter: true })
    .then(() => {
      console.log('Database models synchronized');
    })
    .catch(err => {
      console.error('Failed to sync database models:', err);
    });
}

// Initialize scheduler for periodic tasks
if (process.env.NODE_ENV !== 'test') {
  initScheduler();
}

// API routes
app.get('/api/status', (req, res) => {
  res.json({ status: 'API is running' });
});

// Auth routes (public)
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/user', userRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/referrals', referralRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

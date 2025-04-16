// scheduler.js
const cron = require('node-cron');
const analyticsController = require('./controllers/analyticsController');

/**
 * Schedule tasks to run at specific times
 */
function initScheduler() {
  // Generate daily stats report at 1:00 AM every day
  cron.schedule('0 1 * * *', async () => {
    console.log('Running daily stats generation...');
    try {
      const stats = await analyticsController.generateDailyStats();
      console.log('Daily stats generated successfully:', stats.date);
    } catch (error) {
      console.error('Error generating daily stats:', error);
    }
  });

  console.log('Scheduler initialized');
}

module.exports = { initScheduler }; 
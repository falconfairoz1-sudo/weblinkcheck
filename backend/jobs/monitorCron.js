const cron = require('node-cron');
const { checkMonitors } = require('../controllers/monitorController');

/**
 * Schedule monitor checks every hour
 */
const startMonitorCron = () => {
  // Run every hour at minute 0
  cron.schedule('0 * * * *', async () => {
    console.log('🔍 Running scheduled monitor checks...');
    await checkMonitors();
  });

  console.log('✅ Monitor cron job scheduled (runs every hour)');
};

module.exports = { startMonitorCron };

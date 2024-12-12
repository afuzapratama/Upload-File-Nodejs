const cron = require('node-cron');
const { cleanupExpiredFiles } = require('../controllers/cleanupController');

cron.schedule('0 * * * *', () => {
  cleanupExpiredFiles();
});

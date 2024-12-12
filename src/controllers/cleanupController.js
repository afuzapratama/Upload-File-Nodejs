const File = require('../models/File');
const fs = require('fs');

exports.cleanupExpiredFiles = async () => {
  try {
    const now = new Date();
    const expiredFiles = await File.find({ expiresAt: { $lte: now } });
    for (let f of expiredFiles) {
      fs.unlink(f.path, (err) => {
        if (err) console.error(err);
      });
      await File.findByIdAndDelete(f._id);
    }
    console.log('Expired files cleaned up.');
  } catch (err) {
    console.error('Error cleaning up files:', err);
  }
};

const File = require('../models/File');
const bcrypt = require('bcrypt');

exports.handleUpload = async (req, res, next) => {
  try {
    const { expireHours, usePassword, password } = req.body;
    const hours = parseInt(expireHours, 10) || 24;
    const expireDate = new Date(Date.now() + hours * 3600 * 1000);

    let passwordHash = null;
    if (usePassword === 'on' && password) {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(password, salt);
    }

    const file = new File({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      expiresAt: expireDate,
      passwordHash
    });

    await file.save();
    const downloadLink = `${req.protocol}://${req.get('host')}/download/${file._id}`;
    res.render('uploaded', { title: 'File Uploaded', file, downloadLink });
  } catch (error) {
    next(error);
  }
};

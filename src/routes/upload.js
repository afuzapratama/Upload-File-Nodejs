const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const uploadController = require('../controllers/uploadController');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random()*1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 1024 // Maksimal 1GB
  }
}).single('file');

router.post('/', (req, res, next) => {
  upload(req, res, function(err) {
    if (err) {
      // Jika error karena ukuran file terlalu besar
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).send('File terlalu besar. Maksimal 1GB.');
      }
      // Jika error lain
      return next(err);
    }
    // Jika tidak ada file yang diupload
    if (!req.file) {
      return res.status(400).send('Tidak ada file yang diupload.');
    }

    // Lanjutkan ke controller
    uploadController.handleUpload(req, res, next);
  });
});

module.exports = router;

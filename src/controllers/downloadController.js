const File = require('../models/File');
const fs = require('fs');
const bcrypt = require('bcrypt');

exports.renderDownloadPage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const file = await File.findById(id);

    if (!file) {
      return res.status(404).send('File not found or expired.');
    }

    if (new Date() > file.expiresAt) {
      return res.status(410).send('File has expired.');
    }

    // Jika file punya passwordHash, tampilkan form password dulu
    if (file.passwordHash) {
        return res.render('password', { 
            title: 'Protected File', 
            fileId: file._id,
            fileName: file.originalName,
            error: null // Tambahkan ini
        });
    }

    // Jika tidak ada password, langsung render halaman download
    res.render('download', { title: 'Download File', fileId: file._id, fileName: file.originalName });
  } catch (error) {
    next(error);
  }
};

exports.handlePasswordCheck = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    const file = await File.findById(id);

    if (!file) {
      return res.status(404).send('File not found or expired.');
    }

    // Cek expire
    if (new Date() > file.expiresAt) {
      return res.status(410).send('File has expired.');
    }

    // Cek password
    const match = await bcrypt.compare(password, file.passwordHash);
    if (!match) {
      // Jika password salah, render ulang form password dengan pesan error
      return res.render('password', { 
        title: 'Protected File', 
        fileId: file._id, 
        fileName: file.originalName,
        error: 'Password salah!'
      });
    }

    // Jika password benar, render halaman download
    res.render('download', { title: 'Download File', fileId: file._id, fileName: file.originalName });
  } catch (error) {
    next(error);
  }
};

exports.handleDownload = async (req, res, next) => {
  try {
    const { id } = req.params;
    const file = await File.findById(id);

    if (!file) {
      return res.status(404).send('File not found or expired.');
    }

    if (new Date() > file.expiresAt) {
      fs.unlink(file.path, (err) => {
        if (err) console.error(err);
      });
      await File.findByIdAndDelete(id);
      return res.status(410).send('File has expired.');
    }

    res.download(file.path, file.originalName);
  } catch (error) {
    next(error);
  }
};

const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  path: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  passwordHash: { type: String, default: null } // Tambahan untuk password
}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema);

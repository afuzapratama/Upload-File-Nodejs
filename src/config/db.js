const mongoose = require('mongoose');
require('dotenv').config();

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected.');
  } catch (error) {
    console.error('Error connecting to MongoDB: ', error);
  }
}

module.exports = connectDB;

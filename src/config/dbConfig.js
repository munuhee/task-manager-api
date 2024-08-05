const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Connection URI
    const dbURI = process.env.MONGODB_URI;

    if (!dbURI) {
      throw new Error('MONGODB_URI is not defined in .env file');
    }

    // Connect to MongoDB
    await mongoose.connect(dbURI);

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;

const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error(
      'MONGO_URI is not defined. Create feedbackTracker/.env (copy from .env.example) or export MONGO_URI before starting the server.'
    );
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    const message = error?.message || String(error);
    const dnsSrvError =
      typeof message === 'string' &&
      (message.includes('querySrv') || message.includes('queryA')) &&
      (message.includes('ECONNREFUSED') || message.includes('ENOTFOUND'));

    if (dnsSrvError) {
      throw new Error(
        `MongoDB connection failed due to DNS resolution issues (${message}). If you're using MongoDB Atlas (mongodb+srv), ensure your network/DNS allows external lookups, or use a local MongoDB like mongodb://127.0.0.1:27017/feedbackTracker.`
      );
    }

    throw error;
  }
};

module.exports = connectDB;

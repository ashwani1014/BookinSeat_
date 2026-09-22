const mongoose = require('mongoose');

// Disable command buffering so queries don't hang if MongoDB is offline
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 1500,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`MongoDB Connection Notice: Offline. Server is running in in-memory fallback mode.`);
  }
};

module.exports = connectDB;

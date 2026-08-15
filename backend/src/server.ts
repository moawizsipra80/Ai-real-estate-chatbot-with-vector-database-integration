import app from './app';
import mongoose from 'mongoose';
import { seedProperties } from './seed/propertySeed';

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/realestate';

async function startServer() {
  try {
    // Attempt MongoDB Connection with short timeout
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 2000
    });
    console.log('Successfully connected to MongoDB!');
    await seedProperties();
  } catch (err: any) {
    console.warn('MongoDB connection failed or unavailable. Operating with in-memory dataset mode.');
  }

  app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 Real Estate Backend Server running on port ${PORT}`);
    console.log(`💬 AI Chat API: http://localhost:${PORT}/api/ai/chat`);
    console.log(`🏢 Properties API: http://localhost:${PORT}/api/properties`);
    console.log(`==================================================`);
  });
}

startServer();

import mongoose from 'mongoose';

let isMongoConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/humanity_ai_email';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000, // Quick fail if local MongoDB is not running
    });
    isMongoConnected = true;
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isMongoConnected = false;
    console.log(`[Database] MongoDB not detected (${error.message}). Using built-in persistent in-memory data store.`);
    return false;
  }
};

export const getDBStatus = () => ({
  type: isMongoConnected ? 'MongoDB' : 'In-Memory / JSON Store',
  connected: true,
  isLiveMongo: isMongoConnected,
});

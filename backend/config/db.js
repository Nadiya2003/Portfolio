const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      '[DB] MONGODB_URI is not set. Add it to your environment variables in Vercel dashboard.'
    );
  }

  // Reuse existing connection (important for serverless warm starts)
  if (mongoose.connection.readyState >= 1) {
    console.log('[DB] Reusing existing MongoDB connection');
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      bufferCommands: false,     // Fail fast instead of queuing commands
      serverSelectionTimeoutMS: 10000, // 10s timeout for Atlas cold starts
    });

    console.log(`[DB] MongoDB connected: ${conn.connection.host} / ${conn.connection.name}`);
  } catch (error) {
    console.error('[DB] MongoDB connection failed:', error.message);
    throw error; // Let the caller (index.js) handle it — do NOT process.exit in serverless
  }
};

module.exports = connectDB;


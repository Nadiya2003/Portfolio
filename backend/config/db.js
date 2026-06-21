const mongoose = require('mongoose');

// Global cache for serverless environments
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      '[DB] MONGODB_URI is not set. Add it to your environment variables in Vercel dashboard.'
    );
  }

  // Reuse existing connection from global cache (important for serverless warm starts)
  if (cached.conn) {
    console.log('[DB] Reusing existing MongoDB connection from cache');
    return cached.conn;
  }

  if (mongoose.connection.readyState >= 1) {
    console.log('[DB] Reusing existing mongoose default connection');
    cached.conn = mongoose.connection;
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('[DB] Initializing new MongoDB connection');
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,           // Fail fast instead of queuing commands
      serverSelectionTimeoutMS: 5000,  // 5s timeout (prevents Vercel 10s crash)
    }).then(mongooseInstance => {
      console.log(`[DB] MongoDB connected: ${mongooseInstance.connection.host} / ${mongooseInstance.connection.name}`);
      return mongooseInstance.connection;
    }).catch(error => {
      console.error('[DB] MongoDB connection failed:', error.message);
      cached.promise = null; // Reset promise so next attempt can try again
      throw error; // Let the caller (index.js) handle it — do NOT process.exit in serverless
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    throw error;
  }
};

module.exports = connectDB;


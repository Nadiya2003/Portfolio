const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('<db_password>')) {
      console.warn('\x1b[33m⚠️  MONGODB_URI is either missing or contains the <db_password> placeholder. Please update your .env file with the actual password.\x1b[0m');
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    const date = new Date().toISOString().replace('T', ' ').substring(0, 19);

    console.log('\x1b[32m✅ MongoDB Connected Successfully\x1b[0m');
    console.log(`\x1b[36m📦 Database:\x1b[0m ${conn.connection.name}`);
    console.log(`\x1b[36m🌐 Host:\x1b[0m ${conn.connection.host}`);
    console.log(`\x1b[36m⏰ Connected at:\x1b[0m ${date}\n`);
  } catch (error) {
    console.error('\x1b[31m❌ MongoDB Connection Failed\x1b[0m');
    console.error(`\x1b[31m${error.message}\x1b[0m\n`);
    process.exit(1);
  }
};

module.exports = connectDB;

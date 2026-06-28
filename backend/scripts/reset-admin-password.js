require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const resetPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const admin = await Admin.findOne({ email: 'admin@portfolio.com' });
    if (!admin) {
      console.log('⚠️  Admin not found!');
      process.exit(1);
    }

    admin.password = 'Admin@123';
    await admin.save();

    console.log('🎉 Admin password reset successfully to: Admin@123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Reset failed:', error.message);
    process.exit(1);
  }
};

resetPassword();

require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await Admin.findOne({ email: 'admin@portfolio.com' });
    if (existing) {
      console.log('⚠️  Admin already exists. Skipping seed.');
      process.exit(0);
    }

    await Admin.create({
      name: 'Portfolio Admin',
      email: 'admin@portfolio.com',
      password: 'Admin@123',
      role: 'superadmin',
    });

    console.log('🎉 Admin seeded successfully!');
    console.log('   Email   : admin@portfolio.com');
    console.log('   Password: Admin@123');
    console.log('   ⚠️  Please change your password after first login!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seedAdmin();

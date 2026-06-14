const multer = require('multer');
const path = require('path');

// Check if Cloudinary is configured
const cloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_KEY !== 'your_api_key';

let createStorage;

if (cloudinaryConfigured) {
  const { CloudinaryStorage } = require('multer-storage-cloudinary');
  const cloudinary = require('../config/cloudinary');

  createStorage = (folder) =>
    new CloudinaryStorage({
      cloudinary,
      params: {
        folder: `portfolio/${folder}`,
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif', 'mp4', 'pdf'],
        resource_type: 'auto',
      },
    });
} else {
  // Fallback: store in memory when Cloudinary is not configured
  console.warn('⚠️  Cloudinary not configured — using memory storage. Images will NOT be persisted. Set CLOUDINARY_* env vars in backend/.env to enable image uploads.');
  createStorage = (_folder) => multer.memoryStorage();
}

const upload = (folder = 'general') =>
  multer({
    storage: createStorage(folder),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  });

module.exports = { upload, cloudinaryConfigured };

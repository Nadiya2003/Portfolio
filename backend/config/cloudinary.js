/**
 * config/cloudinary.js
 * Cloudinary v2 SDK configuration with startup validation.
 * Throws a clear error if credentials are missing or placeholder values.
 */

const cloudinary = require('cloudinary').v2;

const REQUIRED_VARS = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
const PLACEHOLDER_VALUES = ['your_cloud_name', 'your_api_key', 'your_api_secret', '', undefined];

/**
 * Returns true if all three Cloudinary env vars are set with real values.
 */
const isConfigured = () =>
  REQUIRED_VARS.every(
    (key) => process.env[key] && !PLACEHOLDER_VALUES.includes(process.env[key])
  );

/**
 * Validates credentials and configures the SDK.
 * Called once at server startup.
 */
const initCloudinary = () => {
  if (!isConfigured()) {
    console.error('\n' + '='.repeat(60));
    console.error('❌  CLOUDINARY NOT CONFIGURED');
    console.error('='.repeat(60));
    console.error('Image uploads will FAIL until you add real credentials.');
    console.error('Edit  backend/.env  and set:');
    console.error('');
    console.error('  CLOUDINARY_CLOUD_NAME=<your cloud name>');
    console.error('  CLOUDINARY_API_KEY=<your api key>');
    console.error('  CLOUDINARY_API_SECRET=<your api secret>');
    console.error('');
    console.error('Get them at  https://cloudinary.com/console');
    console.error('='.repeat(60) + '\n');
    return false;
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure:     true,               // always use https URLs
  });

  console.log('☁️   Cloudinary configured — cloud:', process.env.CLOUDINARY_CLOUD_NAME);
  return true;
};

module.exports = { cloudinary, initCloudinary, isConfigured };

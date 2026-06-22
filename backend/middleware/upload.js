/**
 * middleware/upload.js
 * Vercel-safe, production-grade upload middleware.
 *
 * Strategy
 * ─────────
 * 1. multer.memoryStorage() — ALWAYS used. No disk writes, ever.
 * 2. If Cloudinary is configured → stream buffer to Cloudinary after multer.
 *    req.file / req.files are augmented with:
 *      .path     = secure_url  (Cloudinary HTTPS URL)
 *      .filename = public_id   (used by crudController for deletion)
 * 3. If Cloudinary is NOT configured (local dev without credentials) →
 *    files stay as buffers in memory only. .path will be undefined.
 *    This is intentional — do NOT fall back to disk on Vercel.
 *
 * No fs.mkdirSync, no disk paths, no /uploads directory needed.
 */

'use strict';

const multer  = require('multer');
const stream  = require('stream');
const { cloudinary, isConfigured } = require('../config/cloudinary');

// ── Always use memory storage ─────────────────────────────────────────────────
const memStorage = multer.memoryStorage();

// ── File filter ───────────────────────────────────────────────────────────────
const fileFilter = (_req, file, cb) => {
  const allowedExts = /jpg|jpeg|png|webp|svg|gif|mp4|mov|avi|pdf/i;
  const ext = file.originalname.split('.').pop();
  if (allowedExts.test(ext) || file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
  }
};

// ── Upload a single buffer to Cloudinary ─────────────────────────────────────
const uploadBufferToCloudinary = (buffer, options) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
    const readable = new stream.PassThrough();
    readable.end(buffer);
    readable.pipe(uploadStream);
  });

// ── Determine Cloudinary resource_type from mimetype ─────────────────────────
const getResourceType = (mimetype) => {
  if (mimetype.startsWith('video/')) return 'video';
  if (mimetype === 'application/pdf' || mimetype === 'application/octet-stream') return 'raw';
  return 'image';
};

// ── Stream all in-memory files to Cloudinary ─────────────────────────────────
// This runs AFTER multer has collected all buffers in memory.
const cloudinaryUploadMiddleware = (folder) => async (req, res, next) => {
  if (!isConfigured()) return next(); // local dev without Cloudinary — skip

  try {
    // Handle req.file (single upload)
    if (req.file) {
      const result = await uploadBufferToCloudinary(req.file.buffer, {
        folder: `portfolio/${folder}`,
        resource_type: getResourceType(req.file.mimetype),
        public_id: `${Date.now()}-${req.file.originalname
          .replace(/\.[^.]+$/, '')
          .replace(/[^a-zA-Z0-9_-]/g, '_')}`,
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif', 'mp4', 'mov', 'avi', 'pdf'],
      });
      req.file.path     = result.secure_url;
      req.file.filename = result.public_id;
    }

    // Handle req.files (array or fields)
    if (req.files) {
      const processFile = async (file) => {
        const result = await uploadBufferToCloudinary(file.buffer, {
          folder: `portfolio/${folder}`,
          resource_type: getResourceType(file.mimetype),
          public_id: `${Date.now()}-${Math.round(Math.random() * 1e6)}-${file.originalname
            .replace(/\.[^.]+$/, '')
            .replace(/[^a-zA-Z0-9_-]/g, '_')}`,
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif', 'mp4', 'mov', 'avi', 'pdf'],
        });
        file.path     = result.secure_url;
        file.filename = result.public_id;
      };

      if (Array.isArray(req.files)) {
        // upload.array() or upload.any()
        await Promise.all(req.files.map(processFile));
      } else {
        // upload.fields() — object of { fieldName: [file, ...] }
        const allFiles = Object.values(req.files).flat();
        await Promise.all(allFiles.map(processFile));
      }
    }

    next();
  } catch (err) {
    console.error('[Cloudinary Upload Error]', err.message);
    res.status(500).json({ success: false, message: `File upload failed: ${err.message}` });
  }
};

// ── Factory ───────────────────────────────────────────────────────────────────
/**
 * upload(folder)
 * Returns an object with .single(), .array(), .fields(), .any()
 * Each returns an array of two middleware: [multerMiddleware, cloudinaryMiddleware]
 *
 * Usage in routes (unchanged from before):
 *   router.post('/', protect, upload('projects').fields([...]), ctrl.create);
 */
const upload = (folder = 'general') => {
  const m = multer({
    storage: memStorage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
    fileFilter,
  });
  const toCloudinary = cloudinaryUploadMiddleware(folder);

  return {
    single : (name)           => [m.single(name),          toCloudinary],
    array  : (name, maxCount) => [m.array(name, maxCount), toCloudinary],
    fields : (fields)         => [m.fields(fields),        toCloudinary],
    any    : ()               => [m.any(),                 toCloudinary],
  };
};

// ── Asset deletion ────────────────────────────────────────────────────────────
/**
 * destroyAsset(publicId, resourceType)
 * Deletes from Cloudinary if configured. No-op otherwise.
 */
const destroyAsset = async (publicId, resourceType = 'image') => {
  if (!publicId || !isConfigured()) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.warn(`⚠️  Could not delete Cloudinary asset "${publicId}":`, err.message);
  }
};

module.exports = { upload, destroyAsset };

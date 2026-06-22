/**
 * middleware/upload.js
 * Production-grade Multer middleware.
 *
 * Storage strategy:
 *  - Cloudinary (preferred)  → used whenever CLOUDINARY_* env vars are set.
 *  - /tmp/uploads            → Vercel serverless fallback (writable temp dir).
 *  - ./uploads               → local development fallback only.
 *
 * NOTE: Vercel's /var/task filesystem is read-only at runtime.
 *       We NEVER attempt mkdirSync inside the project root on Vercel.
 */

'use strict';

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary, isConfigured } = require('../config/cloudinary');

// ── Local uploads dir ─────────────────────────────────────────────────────────
// On Vercel (VERCEL env is truthy) the project root is read-only, so we write
// to /tmp instead.  In local dev we keep the familiar ./uploads folder.
const isVercel = !!(process.env.VERCEL || process.env.VERCEL_ENV);
const localUploadsDir = isVercel
  ? path.join('/tmp', 'uploads')                   // writable on Vercel Lambda
  : path.join(__dirname, '..', 'uploads');          // normal local dev path

// Create the directory only when we'll actually use it (i.e. no Cloudinary).
// We defer creation to request-time inside diskStorage.destination so the
// module can be safely required without hitting the filesystem on Vercel.
const ensureLocalDir = () => {
  if (!fs.existsSync(localUploadsDir)) {
    fs.mkdirSync(localUploadsDir, { recursive: true });
  }
};

/**
 * Build storage instance.
 */
const createStorage = (folder) => {
  if (isConfigured()) {
    return new CloudinaryStorage({
      cloudinary,
      params: async (_req, file) => {
        let resource_type = 'image';
        if (file.mimetype.startsWith('video/')) resource_type = 'video';
        else if (file.mimetype === 'application/pdf' || file.mimetype === 'application/octet-stream') resource_type = 'raw';

        return {
          folder: `portfolio/${folder}`,
          resource_type,
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif', 'mp4', 'mov', 'avi', 'pdf'],
          public_id: `${Date.now()}-${file.originalname.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_')}`,
        };
      },
    });
  } else {
    // Local Disk Storage Fallback (local dev only; /tmp/uploads on Vercel)
    return multer.diskStorage({
      destination: (req, file, cb) => {
        ensureLocalDir(); // safe: called per-request, not at require() time
        cb(null, localUploadsDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, folder + '-' + uniqueSuffix + path.extname(file.originalname));
      }
    });
  }
};

/**
 * Middleware wrapper to rewrite local disk paths to absolute URLs
 * so the frontend can render them (http://localhost:5000/uploads/...)
 */
const mapLocalUrl = (req, res, next) => {
  if (isConfigured()) return next(); // Cloudinary provides secure URL natively

  const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`;
  
  if (req.file) {
    req.file.path = baseUrl + req.file.filename;
  }
  if (req.files) {
    if (Array.isArray(req.files)) {
      // upload.array() or upload.any() returns an array
      req.files.forEach(f => {
        f.path = baseUrl + f.filename;
      });
    } else {
      // upload.fields() returns an object where values are arrays of files
      Object.keys(req.files).forEach(key => {
        req.files[key].forEach(f => {
          f.path = baseUrl + f.filename;
        });
      });
    }
  }
  
  next();
};

/**
 * Factory — returns a configured multer instance.
 */
const upload = (folder = 'general') => {
  const m = multer({
    storage: createStorage(folder),
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      const allowed = /jpg|jpeg|png|webp|svg|gif|mp4|mov|avi|pdf/i;
      const ext = file.originalname.split('.').pop();
      if (allowed.test(ext) || file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
      } else {
        cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
      }
    },
  });

  // Return a proxy object that binds the URL mapper
  return {
    single: (name) => [m.single(name), mapLocalUrl],
    array: (name, maxCount) => [m.array(name, maxCount), mapLocalUrl],
    fields: (fields) => [m.fields(fields), mapLocalUrl],
    any: () => [m.any(), mapLocalUrl],
  };
};

/**
 * Safely delete an asset. Handles both Cloudinary and Local disk deletion.
 */
const destroyAsset = async (publicId, resourceType = 'image') => {
  if (!publicId) return;
  
  if (isConfigured()) {
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch (err) {
      console.warn(`⚠️ Could not delete Cloudinary asset "${publicId}":`, err.message);
    }
  } else {
    // Attempt local file deletion
    const filePath = path.join(localUploadsDir, publicId);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch(e) {}
    }
  }
};

module.exports = { upload, destroyAsset };

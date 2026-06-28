/**
 * controllers/crudController.js
 * Generic CRUD factory used by: graphic, uiux, web, video, pencil, project routes.
 * Expects multer-storage-cloudinary: file.path = secure URL, file.filename = public_id.
 */

'use strict';

const { destroyAsset } = require('../middleware/upload');

const createCrudController = (Model) => {

  // ─── GET ALL ──────────────────────────────────────────────────────────────
  const getAll = async (req, res) => {
    try {
      const { page = 1, limit = 20, status, category, type, search } = req.query;
      const filter = {};
      if (status)   filter.status   = status;
      if (category) filter.category = category;
      if (type)     filter.type     = type;
      if (search)   filter.title    = { $regex: search, $options: 'i' };

      const total = await Model.countDocuments(filter);
      const items = await Model.find(filter)
        .sort({ order: 1, createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));

      res.json({ success: true, data: items, total, page: Number(page), limit: Number(limit) });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  // ─── GET ONE ──────────────────────────────────────────────────────────────
  const getOne = async (req, res) => {
    try {
      const item = await Model.findById(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Not found.' });
      res.json({ success: true, data: item });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  // ─── CREATE ───────────────────────────────────────────────────────────────
  const create = async (req, res) => {
    try {
      const data = { ...req.body };

      // Single-file fields
      if (req.files?.thumbnail?.[0]) {
        data.thumbnail          = req.files.thumbnail[0].path;
        data.thumbnailPublicId  = req.files.thumbnail[0].filename;
      }
      if (req.files?.beforeImage?.[0]) {
        data.beforeImage          = req.files.beforeImage[0].path;
        data.beforeImagePublicId  = req.files.beforeImage[0].filename;
      }

      // Multi-file fields
      if (req.files?.gallery?.length) {
        data.gallery = req.files.gallery.map((f) => ({ url: f.path, publicId: f.filename }));
      }
      if (req.files?.screenshots?.length) {
        data.screenshots = req.files.screenshots.map((f) => ({ url: f.path, publicId: f.filename }));
      }
      if (req.files?.artworkImages?.length) {
        data.artworkImages = req.files.artworkImages.map((f) => ({ url: f.path, publicId: f.filename }));
      }

      // Video file
      if (req.files?.video?.[0]) {
        data.videoUrl       = req.files.video[0].path;
        data.videoPublicId  = req.files.video[0].filename;
      }

      // PDF file
      if (req.files?.pdf?.[0]) {
        data.pdfUrl       = req.files.pdf[0].path;
        data.pdfPublicId  = req.files.pdf[0].filename;
      }

      const item = await Model.create(data);
      res.status(201).json({ success: true, data: item });
    } catch (err) {
      console.error('[CRUD create]', err);
      res.status(400).json({ success: false, message: err.message || String(err), err });
    }
  };

  // ─── UPDATE ───────────────────────────────────────────────────────────────
  const update = async (req, res) => {
    try {
      const item = await Model.findById(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Not found.' });

      // Replace or remove thumbnail
      if (req.files?.thumbnail?.[0]) {
        await destroyAsset(item.thumbnailPublicId);
        item.thumbnail         = req.files.thumbnail[0].path;
        item.thumbnailPublicId = req.files.thumbnail[0].filename;
      } else if (req.body.removeThumbnail === 'true') {
        await destroyAsset(item.thumbnailPublicId);
        item.thumbnail = '';
        item.thumbnailPublicId = '';
      }

      // Replace or remove beforeImage
      if (req.files?.beforeImage?.[0]) {
        await destroyAsset(item.beforeImagePublicId);
        item.beforeImage          = req.files.beforeImage[0].path;
        item.beforeImagePublicId  = req.files.beforeImage[0].filename;
      } else if (req.body.removeBeforeImage === 'true') {
        await destroyAsset(item.beforeImagePublicId);
        item.beforeImage = '';
        item.beforeImagePublicId = '';
      }

      // Replace video
      if (req.files?.video?.[0]) {
        await destroyAsset(item.videoPublicId, 'video');
        item.videoUrl      = req.files.video[0].path;
        item.videoPublicId = req.files.video[0].filename;
      }

      // Replace PDF
      if (req.files?.pdf?.[0]) {
        await destroyAsset(item.pdfPublicId, 'raw');
        item.pdfUrl       = req.files.pdf[0].path;
        item.pdfPublicId  = req.files.pdf[0].filename;
      }

      // Handle removal of existing multi-file images
      const handleExistingArray = async (field, bodyKey) => {
        if (req.body[bodyKey]) {
          try {
            const retained = JSON.parse(req.body[bodyKey]);
            const removed = (item[field] || []).filter(img => !retained.find(r => r.publicId === img.publicId));
            for (const img of removed) {
              await destroyAsset(img.publicId);
            }
            item[field] = retained;
          } catch (e) {
            console.error(`Error parsing ${bodyKey}:`, e);
          }
        }
      };

      await handleExistingArray('gallery', 'existingGallery');
      await handleExistingArray('screenshots', 'existingScreenshots');
      await handleExistingArray('artworkImages', 'existingArtworkImages');

      // Append to multi-file arrays
      if (req.files?.gallery?.length) {
        const incoming = req.files.gallery.map((f) => ({ url: f.path, publicId: f.filename }));
        item.gallery = [...(item.gallery || []), ...incoming];
      }
      if (req.files?.screenshots?.length) {
        const incoming = req.files.screenshots.map((f) => ({ url: f.path, publicId: f.filename }));
        item.screenshots = [...(item.screenshots || []), ...incoming];
      }
      if (req.files?.artworkImages?.length) {
        const incoming = req.files.artworkImages.map((f) => ({ url: f.path, publicId: f.filename }));
        item.artworkImages = [...(item.artworkImages || []), ...incoming];
      }

      // Merge scalar body fields
      const bodyFields = { ...req.body };
      Object.keys(bodyFields).forEach((k) => {
        if (!['_id', '__v', 'createdAt', 'updatedAt', 'existingGallery', 'existingScreenshots', 'existingArtworkImages', 'removeThumbnail', 'removeBeforeImage'].includes(k)) {
          item[k] = bodyFields[k];
        }
      });

      await item.save();
      res.json({ success: true, data: item });
    } catch (err) {
      console.error('[CRUD update]', err);
      res.status(400).json({ success: false, message: err.message || String(err), err });
    }
  };

  // ─── DELETE ───────────────────────────────────────────────────────────────
  const remove = async (req, res) => {
    try {
      const item = await Model.findById(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Not found.' });

      // Delete all associated Cloudinary assets
      await destroyAsset(item.thumbnailPublicId);
      await destroyAsset(item.beforeImagePublicId);
      await destroyAsset(item.videoPublicId, 'video');
      await destroyAsset(item.pdfPublicId, 'raw');
      for (const img of [...(item.gallery || []), ...(item.screenshots || []), ...(item.artworkImages || [])]) {
        await destroyAsset(img.publicId);
      }

      await item.deleteOne();
      res.json({ success: true, message: 'Deleted successfully.' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  // ─── REORDER ──────────────────────────────────────────────────────────────
  const reorder = async (req, res) => {
    try {
      const { items } = req.body; // [{ id, order }]
      await Promise.all(items.map(({ id, order }) => Model.findByIdAndUpdate(id, { order })));
      res.json({ success: true, message: 'Reordered.' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  // ─── TOGGLE STATUS ────────────────────────────────────────────────────────
  const toggleStatus = async (req, res) => {
    try {
      const item = await Model.findById(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Not found.' });
      item.status = item.status === 'published' ? 'draft' : 'published';
      await item.save();
      res.json({ success: true, data: item });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  return { getAll, getOne, create, update, remove, reorder, toggleStatus };
};

module.exports = createCrudController;

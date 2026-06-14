const createCrudController = (Model, folder = 'projects') => {
  const cloudinary = require('../config/cloudinary');
  const { cloudinaryConfigured } = require('../middleware/upload');

  // Helper: extract image URL from uploaded file (Cloudinary gives .path, memory gives nothing useful)
  const fileUrl = (file) => {
    if (!file) return null;
    if (cloudinaryConfigured && file.path) return file.path;
    return null; // memory storage — no persistent URL
  };

  const getAll = async (req, res) => {
    try {
      const { page = 1, limit = 20, status, category, search } = req.query;
      const filter = {};
      if (status) filter.status = status;
      if (category) filter.category = category;
      if (search) filter.title = { $regex: search, $options: 'i' };

      const total = await Model.countDocuments(filter);
      const items = await Model.find(filter)
        .sort({ order: 1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

      res.json({ success: true, data: items, total, page: Number(page), limit: Number(limit) });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  const getOne = async (req, res) => {
    try {
      const item = await Model.findById(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Not found.' });
      res.json({ success: true, data: item });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  const create = async (req, res) => {
    try {
      const data = { ...req.body };

      const thumbUrl = fileUrl(req.files?.thumbnail?.[0]);
      if (thumbUrl) {
        data.thumbnail = thumbUrl;
        data.thumbnailPublicId = req.files.thumbnail[0].filename;
      }

      const beforeUrl = fileUrl(req.files?.beforeImage?.[0]);
      if (beforeUrl) {
        data.beforeImage = beforeUrl;
        data.beforeImagePublicId = req.files.beforeImage[0].filename;
      }

      if (req.files?.gallery) {
        data.gallery = req.files.gallery
          .map((f) => fileUrl(f) ? { url: fileUrl(f), publicId: f.filename } : null)
          .filter(Boolean);
      }
      if (req.files?.screenshots) {
        data.screenshots = req.files.screenshots
          .map((f) => fileUrl(f) ? { url: fileUrl(f), publicId: f.filename } : null)
          .filter(Boolean);
      }
      if (req.files?.artworkImages) {
        data.artworkImages = req.files.artworkImages
          .map((f) => fileUrl(f) ? { url: fileUrl(f), publicId: f.filename } : null)
          .filter(Boolean);
      }

      const item = await Model.create(data);
      res.status(201).json({ success: true, data: item });
    } catch (error) {
      console.error('Create error:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  };

  const update = async (req, res) => {
    try {
      const item = await Model.findById(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Not found.' });

      const fieldsToSave = { ...req.body };

      if (req.files) {
        const thumbFile = req.files.thumbnail?.[0];
        if (thumbFile) {
          const url = fileUrl(thumbFile);
          if (url) {
            if (cloudinaryConfigured && item.thumbnailPublicId) {
              await cloudinary.uploader.destroy(item.thumbnailPublicId).catch(() => {});
            }
            fieldsToSave.thumbnail = url;
            fieldsToSave.thumbnailPublicId = thumbFile.filename;
          }
        }

        const beforeFile = req.files.beforeImage?.[0];
        if (beforeFile) {
          const url = fileUrl(beforeFile);
          if (url) {
            if (cloudinaryConfigured && item.beforeImagePublicId) {
              await cloudinary.uploader.destroy(item.beforeImagePublicId).catch(() => {});
            }
            fieldsToSave.beforeImage = url;
            fieldsToSave.beforeImagePublicId = beforeFile.filename;
          }
        }
      }

      Object.assign(item, fieldsToSave);

      if (req.files?.gallery) {
        const newImages = req.files.gallery
          .map((f) => fileUrl(f) ? { url: fileUrl(f), publicId: f.filename } : null)
          .filter(Boolean);
        if (newImages.length) item.gallery = [...(item.gallery || []), ...newImages];
      }
      if (req.files?.screenshots) {
        const newScreenshots = req.files.screenshots
          .map((f) => fileUrl(f) ? { url: fileUrl(f), publicId: f.filename } : null)
          .filter(Boolean);
        if (newScreenshots.length) item.screenshots = [...(item.screenshots || []), ...newScreenshots];
      }
      if (req.files?.artworkImages) {
        const newArtwork = req.files.artworkImages
          .map((f) => fileUrl(f) ? { url: fileUrl(f), publicId: f.filename } : null)
          .filter(Boolean);
        if (newArtwork.length) item.artworkImages = [...(item.artworkImages || []), ...newArtwork];
      }

      await item.save();
      res.json({ success: true, data: item });
    } catch (error) {
      console.error('Update error:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  };

  const remove = async (req, res) => {
    try {
      const item = await Model.findById(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Not found.' });

      if (cloudinaryConfigured) {
        if (item.thumbnailPublicId) await cloudinary.uploader.destroy(item.thumbnailPublicId).catch(() => {});
        if (item.beforeImagePublicId) await cloudinary.uploader.destroy(item.beforeImagePublicId).catch(() => {});
        const galleries = [...(item.gallery || []), ...(item.screenshots || []), ...(item.artworkImages || [])];
        for (const img of galleries) {
          if (img.publicId) await cloudinary.uploader.destroy(img.publicId).catch(() => {});
        }
      }

      await item.deleteOne();
      res.json({ success: true, message: 'Deleted successfully.' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  const reorder = async (req, res) => {
    try {
      const { items } = req.body;
      for (const { id, order } of items) {
        await Model.findByIdAndUpdate(id, { order });
      }
      res.json({ success: true, message: 'Reordered.' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  const toggleStatus = async (req, res) => {
    try {
      const item = await Model.findById(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Not found.' });
      item.status = item.status === 'published' ? 'draft' : 'published';
      await item.save();
      res.json({ success: true, data: item });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  return { getAll, getOne, create, update, remove, reorder, toggleStatus };
};

module.exports = createCrudController;

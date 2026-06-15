const MediaFile = require('../models/MediaFile');
const { destroyAsset } = require('../middleware/upload');

// GET /api/media
const getMedia = async (req, res) => {
  try {
    const { page = 1, limit = 50, folder, resourceType, search } = req.query;
    const filter = {};
    if (folder) filter.folder = folder;
    if (resourceType) filter.resourceType = resourceType;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const total = await MediaFile.countDocuments(filter);
    const files = await MediaFile.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, data: files, total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/media/upload
const uploadMedia = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ success: false, message: 'No files uploaded.' });

    const savedFiles = await Promise.all(
      req.files.map(async (file) => {
        return await MediaFile.create({
          name: file.originalname,
          url: file.path,
          publicId: file.filename,
          resourceType: file.mimetype.startsWith('video') ? 'video' : file.mimetype === 'application/pdf' ? 'raw' : 'image',
          format: file.mimetype.split('/')[1],
          size: file.size,
          folder: req.body.folder || 'general',
          uploadedBy: req.admin._id,
        });
      })
    );

    res.status(201).json({ success: true, data: savedFiles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/media/:id
const deleteMedia = async (req, res) => {
  try {
    const file = await MediaFile.findById(req.params.id);
    if (!file) return res.status(404).json({ success: false, message: 'File not found.' });

    await destroyAsset(file.publicId, file.resourceType === 'raw' ? 'raw' : file.resourceType);
    await file.deleteOne();

    res.json({ success: true, message: 'File deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMedia, uploadMedia, deleteMedia };

const mongoose = require('mongoose');

const mediaFileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    resourceType: { type: String, enum: ['image', 'video', 'raw'], default: 'image' },
    format: { type: String, default: '' },
    size: { type: Number, default: 0 },
    folder: { type: String, default: 'general' },
    width: { type: Number },
    height: { type: Number },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MediaFile', mediaFileSchema);

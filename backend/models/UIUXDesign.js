const mongoose = require('mongoose');

const uiuxSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['Mobile App', 'Website', 'Dashboard', 'Wireframe', 'Case Study', 'Other'],
      required: true,
    },
    description: { type: String, default: '' },
    designProcess: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    thumbnailPublicId: { type: String, default: '' },
    beforeImage: { type: String, default: '' },
    beforeImagePublicId: { type: String, default: '' },
    screenshots: [{ url: String, publicId: String }],
    figmaLink: { type: String, default: '' },
    prototypeLink: { type: String, default: '' },
    tags: [{ type: String }],
    tools: [{ type: String }],
    status: { type: String, enum: ['published', 'draft', 'archived'], default: 'published' },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('UIUXDesign', uiuxSchema);

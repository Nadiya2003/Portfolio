const mongoose = require('mongoose');

const videoProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['Video Editing', 'Reel', 'Motion Graphics', 'Promotional', 'Documentary', 'Other'],
      required: true,
    },
    description: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    thumbnailPublicId: { type: String, default: '' },
    beforeImage: { type: String, default: '' },
    beforeImagePublicId: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    videoPublicId: { type: String, default: '' },
    youtubeUrl: { type: String, default: '' },
    duration: { type: String, default: '' },
    tags: [{ type: String }],
    tools: [{ type: String }],
    status: { type: String, enum: ['published', 'draft', 'archived'], default: 'published' },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('VideoProject', videoProjectSchema);

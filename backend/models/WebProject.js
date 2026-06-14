const mongoose = require('mongoose');

const webProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['Frontend', 'Backend', 'Full Stack', 'E-Commerce', 'Portfolio', 'Landing Page', 'Web App', 'Other'],
      required: true,
    },
    description: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    thumbnailPublicId: { type: String, default: '' },
    beforeImage: { type: String, default: '' },
    beforeImagePublicId: { type: String, default: '' },
    screenshots: [{ url: String, publicId: String }],
    technologies: [{ type: String }],
    githubUrl: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
    demoVideoUrl: { type: String, default: '' },
    tags: [{ type: String }],
    status: { type: String, enum: ['published', 'draft', 'archived'], default: 'published' },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('WebProject', webProjectSchema);

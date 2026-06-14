const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['UI/UX Design', 'Web Development', 'Graphic Design', 'Video Editing', 'Pencil Art', 'Motion Graphics', 'Other'],
      required: true,
    },
    description: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    beforeImage: { type: String, default: '' },
    beforeImagePublicId: { type: String, default: '' },
    tags: [{ type: String }],
    thumbnailPublicId: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    coverImagePublicId: { type: String, default: '' },
    gallery: [{ url: String, publicId: String }],
    technologies: [{ type: String }],
    tags: [{ type: String }],
    clientName: { type: String, default: '' },
    completionDate: { type: Date },
    liveUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    behanceUrl: { type: String, default: '' },
    dribbbleUrl: { type: String, default: '' },
    status: { type: String, enum: ['published', 'draft', 'archived'], default: 'published' },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);


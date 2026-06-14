const mongoose = require('mongoose');

const pencilArtSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['Portrait', 'Realistic Sketch', 'Custom Artwork', 'Illustration', 'Concept Art', 'Character Design', 'Other'],
      required: true,
    },
    description: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    thumbnailPublicId: { type: String, default: '' },
    beforeImage: { type: String, default: '' },
    beforeImagePublicId: { type: String, default: '' },
    artworkImages: [{ url: String, publicId: String }],
    medium: { type: String, default: '' },
    dimensions: { type: String, default: '' },
    tags: [{ type: String }],
    status: { type: String, enum: ['published', 'draft', 'archived'], default: 'published' },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PencilArt', pencilArtSchema);

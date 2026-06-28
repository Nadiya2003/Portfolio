const mongoose = require('mongoose');

const graphicDesignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['Logo Design', 'Flyer Design', 'Banner Design', 'Branding', 'Social Media', 'Packaging', 'Business Cards', 'Other'],
      required: true,
    },
    description: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    thumbnailPublicId: { type: String, default: '' },
    beforeImage: { type: String, default: '' },
    beforeImagePublicId: { type: String, default: '' },
    gallery: [{ url: String, publicId: String }],
    pdfUrl: { type: String, default: '' },
    pdfPublicId: { type: String, default: '' },
    clientName: { type: String, default: '' },
    tags: [{ type: String }],
    status: { type: String, enum: ['published', 'draft', 'archived'], default: 'published' },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GraphicDesign', graphicDesignSchema);

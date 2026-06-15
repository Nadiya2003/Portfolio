const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    thumbnail: { type: String, default: '' },
    thumbnailPublicId: { type: String, default: '' },
    position: { type: String, default: '' },
    company: { type: String, default: '' },
    content: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    projectReference: { type: String, default: '' },
    status: { type: String, enum: ['published', 'draft', 'archived'], default: 'published' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);

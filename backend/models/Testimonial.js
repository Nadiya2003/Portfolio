const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true, trim: true },
    clientPhoto: { type: String, default: '' },
    clientPhotoPublicId: { type: String, default: '' },
    position: { type: String, default: '' },
    company: { type: String, default: '' },
    content: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    projectReference: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);

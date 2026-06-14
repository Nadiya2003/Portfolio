const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    icon: { type: String, required: true }, // lucide react icon name
    color: { type: String, default: 'blue' },
    skills: [{ type: String }],
    status: { type: String, enum: ['published', 'draft', 'archived'], default: 'published' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);

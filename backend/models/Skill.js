const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: Number, default: 50, min: 0, max: 100 },
  icon: { type: String, default: '' }, // optional icon url or emoji
});

const skillCategorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true },
  displayStyle: { type: String, enum: ['rings', 'bars'], default: 'rings' },
  tools: [toolSchema],
  order: { type: Number, default: 0 },
});

const skillSchema = new mongoose.Schema(
  {
    categories: [skillCategorySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Skill', skillSchema);

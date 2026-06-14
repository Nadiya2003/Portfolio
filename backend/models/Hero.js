const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema(
  {
    fullName: { type: String, default: '' },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    bio: { type: String, default: '' },
    heroImage: { type: String, default: '' },
    heroImagePublicId: { type: String, default: '' },
    backgroundImage: { type: String, default: '' },
    backgroundImagePublicId: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
    resumePublicId: { type: String, default: '' },
    ctaText: { type: String, default: 'View My Work' },
    ctaSecondaryText: { type: String, default: 'Contact Me' },
    stats: [
      {
        label: String,
        value: Number,
        suffix: String,
      },
    ],
    socials: {
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      whatsapp: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      behance: { type: String, default: '' },
      dribbble: { type: String, default: '' },
      instagram: { type: String, default: '' },
      facebook: { type: String, default: '' },
      twitter: { type: String, default: '' },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Hero', heroSchema);

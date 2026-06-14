const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'My Portfolio' },
    tagline: { type: String, default: '' },
    logo: { type: String, default: '' },
    logoPublicId: { type: String, default: '' },
    favicon: { type: String, default: '' },
    faviconPublicId: { type: String, default: '' },
    footerText: { type: String, default: '' },
    copyrightText: { type: String, default: '' },
    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
      socialPreviewImage: { type: String, default: '' },
      socialPreviewImagePublicId: { type: String, default: '' },
      keywords: [{ type: String }],
    },
    contact: {
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      whatsapp: { type: String, default: '' },
      address: { type: String, default: '' },
      mapLink: { type: String, default: '' },
    },
    socials: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      github: { type: String, default: '' },
      behance: { type: String, default: '' },
      dribbble: { type: String, default: '' },
      youtube: { type: String, default: '' },
    },
    maintenanceMode: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);

const SiteSettings = require('../models/SiteSettings');
const cloudinary = require('../config/cloudinary');

const getSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = await SiteSettings.create({});
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = new SiteSettings();

    const fields = ['siteName', 'tagline', 'footerText', 'copyrightText', 'seo', 'contact', 'socials', 'maintenanceMode'];
    fields.forEach((f) => { 
      if (req.body[f] !== undefined) {
        if ((f === 'seo' || f === 'contact' || f === 'socials') && typeof req.body[f] === 'string') {
          try { settings[f] = JSON.parse(req.body[f]); } catch(e) { settings[f] = req.body[f]; }
        } else if (f === 'maintenanceMode') {
          settings[f] = req.body[f] === 'true';
        } else {
          settings[f] = req.body[f]; 
        }
      } 
    });

    if (req.files?.logo?.[0]) {
      if (settings.logoPublicId) await cloudinary.uploader.destroy(settings.logoPublicId);
      settings.logo = req.files.logo[0].path;
      settings.logoPublicId = req.files.logo[0].filename;
    }
    if (req.files?.favicon?.[0]) {
      if (settings.faviconPublicId) await cloudinary.uploader.destroy(settings.faviconPublicId);
      settings.favicon = req.files.favicon[0].path;
      settings.faviconPublicId = req.files.favicon[0].filename;
    }

    await settings.save();
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSettings, updateSettings };

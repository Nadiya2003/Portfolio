const Hero = require('../models/Hero');
const { destroyAsset } = require('../middleware/upload');

// GET /api/hero
const getHero = async (req, res) => {
  try {
    let hero = await Hero.findOne();
    if (!hero) hero = await Hero.create({});
    res.json({ success: true, data: hero });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/hero
const updateHero = async (req, res) => {
  try {
    let hero = await Hero.findOne();
    if (!hero) hero = new Hero();

    const fields = ['fullName', 'title', 'subtitle', 'bio', 'ctaText', 'ctaSecondaryText', 'stats', 'introLines'];
    fields.forEach((f) => { 
      if (req.body[f] !== undefined) {
        if ((f === 'stats' || f === 'introLines') && typeof req.body[f] === 'string') {
          try { hero[f] = JSON.parse(req.body[f]); } catch(e) { hero[f] = req.body[f]; }
        } else {
          hero[f] = req.body[f];
        }
      } 
    });

    if (req.files?.heroImage?.[0]) {
      await destroyAsset(hero.heroImagePublicId);
      hero.heroImage = req.files.heroImage[0].path;
      hero.heroImagePublicId = req.files.heroImage[0].filename;
    }
    if (req.files?.backgroundImage?.[0]) {
      await destroyAsset(hero.backgroundImagePublicId);
      hero.backgroundImage = req.files.backgroundImage[0].path;
      hero.backgroundImagePublicId = req.files.backgroundImage[0].filename;
    }
    if (req.files?.resume?.[0]) {
      await destroyAsset(hero.resumePublicId, 'raw');
      hero.resumeUrl = req.files.resume[0].path;
      hero.resumePublicId = req.files.resume[0].filename;
    }

    await hero.save();
    res.json({ success: true, data: hero });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getHero, updateHero };

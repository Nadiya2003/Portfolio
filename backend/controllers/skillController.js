const Skill = require('../models/Skill');

const getSkills = async (req, res) => {
  try {
    let skills = await Skill.findOne();
    if (!skills) skills = await Skill.create({ categories: [] });
    res.json({ success: true, data: skills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateSkills = async (req, res) => {
  try {
    let skills = await Skill.findOne();
    if (!skills) skills = new Skill({ categories: [] });

    const { categories } = req.body;
    if (categories !== undefined) {
      if (typeof categories === 'string') {
        try {
          skills.categories = JSON.parse(categories);
        } catch {
          skills.categories = [];
        }
      } else {
        skills.categories = categories;
      }
    }

    await skills.save();
    res.json({ success: true, data: skills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSkills, updateSkills };

const About = require('../models/About');
const { destroyAsset } = require('../middleware/upload');

const getAbout = async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) about = await About.create({});
    res.json({ success: true, data: about });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateAbout = async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) about = new About();

    const fields = ['heading', 'subHeading', 'description', 'yearsOfExperience', 'completedProjects', 'skills', 'experience', 'education'];
    fields.forEach((f) => { 
      if (req.body[f] !== undefined) {
        if ((f === 'skills' || f === 'experience' || f === 'education') && typeof req.body[f] === 'string') {
          try {
            about[f] = JSON.parse(req.body[f]);
          } catch (e) {
            about[f] = [];
          }
        } else {
          about[f] = req.body[f]; 
        }
      }
    });

    if (req.file) {
      await destroyAsset(about.profileImagePublicId);
      about.profileImage = req.file.path;
      about.profileImagePublicId = req.file.filename;
    }

    await about.save();
    res.json({ success: true, data: about });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAbout, updateAbout };

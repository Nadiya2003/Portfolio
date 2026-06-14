const express = require('express');
const router = express.Router();
const { getHero, updateHero } = require('../controllers/heroController');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

router.get('/', getHero);
router.put('/', protect, upload('hero').fields([
  { name: 'heroImage', maxCount: 1 },
  { name: 'backgroundImage', maxCount: 1 },
  { name: 'resume', maxCount: 1 },
]), updateHero);

module.exports = router;

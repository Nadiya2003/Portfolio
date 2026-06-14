const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

router.get('/', getSettings);
router.put('/', protect, upload('settings').fields([
  { name: 'logo', maxCount: 1 },
  { name: 'favicon', maxCount: 1 },
  { name: 'socialPreviewImage', maxCount: 1 },
]), updateSettings);

module.exports = router;

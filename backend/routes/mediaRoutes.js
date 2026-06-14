const express = require('express');
const router = express.Router();
const { getMedia, uploadMedia, deleteMedia } = require('../controllers/mediaController');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

router.get('/', protect, getMedia);
router.post('/upload', protect, upload('media').array('files', 50), uploadMedia);
router.delete('/:id', protect, deleteMedia);

module.exports = router;

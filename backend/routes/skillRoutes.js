const express = require('express');
const router = express.Router();
const { getSkills, updateSkills } = require('../controllers/skillController');
const { protect } = require('../middleware/auth');

router.get('/', getSkills);
router.put('/', protect, updateSkills);

module.exports = router;

const express = require('express');
const router = express.Router();
const createCrudController = require('../controllers/crudController');
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const ctrl = createCrudController(Project, 'projects');
const uploader = upload('projects').fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'beforeImage', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 },
  { name: 'gallery', maxCount: 20 },
]);

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);
router.post('/', protect, uploader, ctrl.create);
router.put('/:id', protect, uploader, ctrl.update);
router.delete('/:id', protect, ctrl.remove);
router.post('/reorder', protect, ctrl.reorder);
router.patch('/:id/toggle-status', protect, ctrl.toggleStatus);

module.exports = router;


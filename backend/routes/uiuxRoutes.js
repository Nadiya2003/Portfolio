const express = require('express');
const router = express.Router();
const createCrudController = require('../controllers/crudController');
const UIUXDesign = require('../models/UIUXDesign');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const ctrl = createCrudController(UIUXDesign, 'uiux');
const uploader = upload('uiux').fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'beforeImage', maxCount: 1 },
  { name: 'screenshots', maxCount: 20 },
]);

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);
router.post('/', protect, uploader, ctrl.create);
router.put('/:id', protect, uploader, ctrl.update);
router.delete('/:id', protect, ctrl.remove);
router.post('/reorder', protect, ctrl.reorder);
router.patch('/:id/toggle-status', protect, ctrl.toggleStatus);

module.exports = router;


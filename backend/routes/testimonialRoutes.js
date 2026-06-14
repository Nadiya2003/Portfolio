const express = require('express');
const router = express.Router();
const createCrudController = require('../controllers/crudController');
const Testimonial = require('../models/Testimonial');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const ctrl = createCrudController(Testimonial, 'testimonials');
const uploader = upload('testimonials').fields([
  { name: 'clientPhoto', maxCount: 1 },
]);

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);
router.post('/', protect, uploader, ctrl.create);
router.put('/:id', protect, uploader, ctrl.update);
router.delete('/:id', protect, ctrl.remove);
router.post('/reorder', protect, ctrl.reorder);

module.exports = router;

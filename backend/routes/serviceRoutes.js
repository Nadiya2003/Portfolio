const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { protect } = require('../middleware/auth');

// GET all services (public)
router.get('/', async (req, res) => {
  try {
    const items = await Service.find().sort({ createdAt: -1 });
    res.json({ success: true, data: items, total: items.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single service
router.get('/:id', async (req, res) => {
  try {
    const item = await Service.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// CREATE service (auth required, JSON body)
router.post('/', protect, async (req, res) => {
  try {
    const { title, icon, color, skills, status } = req.body;
    const service = await Service.create({ title, icon, color, skills, status });
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// UPDATE service (auth required, JSON body)
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, icon, color, skills, status } = req.body;
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { title, icon, color, skills, status },
      { new: true, runValidators: true }
    );
    if (!service) return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE service (auth required)
router.delete('/:id', protect, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, message: 'Deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

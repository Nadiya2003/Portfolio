const express = require('express');
const router = express.Router();
const { createContact, getContacts, toggleRead, deleteContact, getStats } = require('../controllers/contactController');
const { protect } = require('../middleware/auth');

router.post('/', createContact);
router.get('/stats', protect, getStats);
router.get('/', protect, getContacts);
router.patch('/:id/read', protect, toggleRead);
router.delete('/:id', protect, deleteContact);

module.exports = router;

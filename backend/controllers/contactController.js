const Contact = require('../models/Contact');

// POST /api/contact (existing - keep for portfolio frontend)
const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message)
      return res.status(400).json({ error: 'Missing required fields' });

    const contact = await Contact.create({ name, email, subject, message });
    res.status(201).json({ success: true, data: contact });
  } catch (error) {
    console.error('Contact API Error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

// GET /api/contact (admin only)
const getContacts = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, isRead } = req.query;
    const filter = {};
    if (search) filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { subject: { $regex: search, $options: 'i' } },
    ];
    if (isRead !== undefined) filter.isRead = isRead === 'true';

    const total = await Contact.countDocuments(filter);
    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, data: contacts, total, page: Number(page) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/contact/:id/read
const toggleRead = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Message not found.' });
    contact.isRead = !contact.isRead;
    await contact.save();
    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/contact/:id
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Message not found.' });
    res.json({ success: true, message: 'Message deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/contact/stats
const getStats = async (req, res) => {
  try {
    const Project = require('../models/Project');
    const GraphicDesign = require('../models/GraphicDesign');
    const UIUXDesign = require('../models/UIUXDesign');
    const WebProject = require('../models/WebProject');
    const VideoProject = require('../models/VideoProject');
    const PencilArt = require('../models/PencilArt');

    const [
      totalMessages, unreadMessages, totalProjects,
      totalGraphic, totalUIUX, totalWeb, totalVideo, totalPencil,
    ] = await Promise.all([
      Contact.countDocuments(),
      Contact.countDocuments({ isRead: false }),
      Project.countDocuments({ status: 'published' }),
      GraphicDesign.countDocuments({ status: 'published' }),
      UIUXDesign.countDocuments({ status: 'published' }),
      WebProject.countDocuments({ status: 'published' }),
      VideoProject.countDocuments({ status: 'published' }),
      PencilArt.countDocuments({ status: 'published' }),
    ]);

    res.json({
      success: true,
      data: { totalMessages, unreadMessages, totalProjects, totalGraphic, totalUIUX, totalWeb, totalVideo, totalPencil },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createContact, getContacts, toggleRead, deleteContact, getStats };

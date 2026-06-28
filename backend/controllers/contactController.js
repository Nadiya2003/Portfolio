const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NOTIFY_EMAIL,
      pass: process.env.NOTIFY_EMAIL_PASS,
    },
  });
};

// Send notification email to yourself
const sendNotificationEmail = async ({ name, email, subject, message }) => {
  if (!process.env.NOTIFY_EMAIL || !process.env.NOTIFY_EMAIL_PASS) return;
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.NOTIFY_EMAIL}>`,
      to: process.env.NOTIFY_EMAIL,
      subject: `📩 New Contact: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; border-radius: 8px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 24px; text-align: center;">
            <h2 style="color: white; margin: 0; font-size: 20px;">📩 New Portfolio Message</h2>
          </div>
          <div style="padding: 28px; background: white;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 10px 0; color: #666; width: 100px;"><strong>From:</strong></td><td style="padding: 10px 0; color: #333;">${name}</td></tr>
              <tr><td style="padding: 10px 0; color: #666;"><strong>Email:</strong></td><td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #667eea;">${email}</a></td></tr>
              <tr><td style="padding: 10px 0; color: #666;"><strong>Subject:</strong></td><td style="padding: 10px 0; color: #333;">${subject}</td></tr>
            </table>
            <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
            <p style="color: #666; margin: 0 0 8px;"><strong>Message:</strong></p>
            <p style="color: #333; background: #f5f5f5; padding: 16px; border-radius: 6px; margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          <div style="padding: 16px 28px; background: #f9f9f9; text-align: center;">
            <a href="mailto:${email}" style="display: inline-block; background: #667eea; color: white; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-size: 14px;">Reply to ${name}</a>
          </div>
        </div>
      `,
    });
    console.log('✅ Notification email sent for:', email);
  } catch (err) {
    console.error('⚠️ Email notification failed (non-blocking):', err.message);
  }
};

// POST /api/contact (existing - keep for portfolio frontend)
const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message)
      return res.status(400).json({ error: 'Missing required fields' });

    const contact = await Contact.create({ name, email, subject, message });

    // Send notification email (non-blocking)
    sendNotificationEmail({ name, email, subject, message });
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

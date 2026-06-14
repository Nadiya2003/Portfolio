require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL,
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check
app.get('/', (req, res) => res.send('Portfolio Backend API is running'));
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Routes
const authRoutes = require('./routes/authRoutes');
const heroRoutes = require('./routes/heroRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/graphic', require('./routes/graphicRoutes'));
app.use('/api/uiux', require('./routes/uiuxRoutes'));
app.use('/api/web', require('./routes/webRoutes'));
app.use('/api/video', require('./routes/videoRoutes'));
app.use('/api/pencil', require('./routes/pencilRoutes'));
app.use('/api/testimonials', require('./routes/testimonialRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/media', require('./routes/mediaRoutes'));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`\n\x1b[36m🚀 Server running on port ${port}\x1b[0m`);
});

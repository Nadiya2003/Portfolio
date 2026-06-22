require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();
const port = process.env.PORT || 5000;

// Initialize Cloudinary
const { initCloudinary } = require('./config/cloudinary');
initCloudinary();

// Connect to DB via middleware for serverless (ensures DB is ready before any route fires)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('[REQUEST] DB connection failed:', err.message);
    res.status(500).json({ success: false, message: 'Database connection failed' });
  }
});

// Vercel Rewrite Fix: Strip the `/_/backend` prefix so Express can match `/api/...` correctly
app.use((req, res, next) => {
  if (req.url.startsWith('/_/backend')) {
    req.url = req.url.replace('/_/backend', '');
  }
  next();
});

// ── CORS ──────────────────────────────────────────────────────────────────────
// Use a function-based origin validator so we handle:
//   - exact matches (with or without trailing slash)
//   - localhost in any dev environment
//   - FRONTEND_URL / ADMIN_URL set via Vercel env vars
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
].filter(Boolean).map((o) => o.replace(/\/$/, '')); // strip trailing slashes

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server requests (no origin header) and all allowed origins
    if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Blocked origin: ${origin}`);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Explicitly handle OPTIONS preflight for all routes
// (Required on Vercel serverless — preflights don't go through keep-alive middleware)
app.options('*', cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static uploads only in local dev (Cloudinary is used in production).
// Vercel's /var/task is read-only, so never attempt to serve from project root.
if (!process.env.VERCEL && !process.env.VERCEL_ENV) {
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
}

// Health check
app.get('/', (req, res) => res.send('Portfolio Backend API is running'));
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));
app.get('/api/test', (req, res) => res.json({ success: true, message: 'API is working correctly', timestamp: new Date() }));

// Debug endpoint — verify env vars are loaded (safe: shows keys, not values)
app.get('/api/debug', (req, res) => {
  const mongoose = require('mongoose');
  const dbState = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({
    status: 'ok',
    node_env: process.env.NODE_ENV || 'not set',
    db_state: dbState[mongoose.connection.readyState] || 'unknown',
    db_name: mongoose.connection.name || 'not connected',
    env_vars_present: {
      MONGODB_URI:           !!process.env.MONGODB_URI,
      JWT_SECRET:            !!process.env.JWT_SECRET,
      CLOUDINARY_CLOUD_NAME: !!process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY:    !!process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: !!process.env.CLOUDINARY_API_SECRET,
      FRONTEND_URL:          process.env.FRONTEND_URL || 'not set',
      ADMIN_URL:             process.env.ADMIN_URL || 'not set',
    },
  });
});

// Routes
const authRoutes = require('./routes/authRoutes');
const heroRoutes = require('./routes/heroRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/skills', require('./routes/skillRoutes'));
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
  console.error('\n[Global Error]', err);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error', error: err });
});

// Catch-all 404 handler to prevent Vercel Serverless hanging
app.use((req, res) => {
  console.warn(`[404] Unmatched route: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});


// Vercel serverless functions require exporting the app instead of calling app.listen()
// We only call app.listen() if we are running locally (e.g. via nodemon)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`[SERVER] Running locally on port ${port} | NODE_ENV=${process.env.NODE_ENV || 'not set'}`);
  });
}

// Export for Vercel Serverless
module.exports = app;


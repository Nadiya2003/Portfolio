require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const mongoose = require('mongoose');

// Connect to database
connectDB();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const contactRoutes = require('./routes/contactRoutes');
app.use('/api/contact', contactRoutes);

app.get('/', (req, res) => {
  res.send('Backend Server is running');
});

app.get("/test-db", async (req, res) => {
  try {
    await mongoose.connection.db.collection("test").insertOne({
      name: "Portfolio Test",
      createdAt: new Date(),
    });

    res.json({ message: "Data inserted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`\n\x1b[36m🚀 Server running on port ${port}\x1b[0m`);
});

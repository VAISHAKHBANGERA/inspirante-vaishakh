const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const registrationRoutes = require('./routes/registrations');

// Import models for auto-seeding
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files from client/ folder
app.use(express.static(path.join(__dirname, '..', 'client')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api', registrationRoutes);

// Catch-all: serve index.html for any non-API routes (SPA support)
app.use((req, res, next) => {
  if (!req.path.startsWith('/api')) {
    return res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
  }
  next();
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ message: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3000;

connectDB().then(async () => {
  // Auto-seed admin user and some students if no users exist
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('No users found. Auto-seeding initial users...');
      const adminHash = await bcrypt.hash('inspirante2026', 10);
      const studentHash = await bcrypt.hash('student123', 10);
      
      await User.create({
        name: 'Admin',
        username: 'admin',
        password: adminHash,
        role: 'admin'
      });
      
      await User.create({
        name: 'Asha Rao',
        username: 'asha.rao',
        password: studentHash,
        role: 'student'
      });
      console.log('Seeded initial users successfully.');
    }
  } catch (err) {
    console.error('Failed to auto-seed users:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

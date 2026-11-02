const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, getMongoStatus } = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Attempt database connection
connectDB();

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/venues', require('./routes/venueRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/invitations', require('./routes/inviteRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/super-admin', require('./routes/superAdminRoutes'));

// Root / Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    platform: 'UtsavMitra – AI-Powered Event Management Platform',
    timestamp: new Date().toISOString(),
    database: getMongoStatus() ? 'MongoDB' : 'High-Performance Persistent Store',
    interfaces: {
      user: 'Ready',
      organizer: 'Ready',
      admin: 'Ready (Full platform data aggregation)',
      superAdmin: 'Ready (Master control + Admin management)'
    }
  });
});

// 404 Handler
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `API endpoint ${req.originalUrl} not found.` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  🪔 UtsavMitra Event Management Backend Active! 🪔 `);
  console.log(`  Running on: http://localhost:${PORT}`);
  console.log(`  API Health: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});


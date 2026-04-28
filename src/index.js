// ============================================
// Express App Entry Point
// ============================================

require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/products');

// Import error handler
const { errorHandler } = require('./middleware/errorHandler');

// Initialize Express app
const app = express();

// --------------------------------------------
// Security & Utility Middleware
// --------------------------------------------

// Helmet: secure HTTP headers
app.use(helmet());

// CORS: allow frontend to communicate with API
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true, // Allow cookies to be sent
}));

// Compression: gzip responses
app.use(compression());

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parsing (for refresh tokens)
app.use(cookieParser());

// --------------------------------------------
// Health Check
// --------------------------------------------
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --------------------------------------------
// API Routes
// --------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/auth', userRoutes); // /api/auth/me handled by user routes
app.use('/api/products', productRoutes);

// --------------------------------------------
// 404 Handler
// --------------------------------------------
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found.`,
    },
  });
});

// --------------------------------------------
// Centralized Error Handler
// --------------------------------------------
app.use(errorHandler);

// --------------------------------------------
// Start Server
// --------------------------------------------
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(async () => {
    const prisma = require('./config/prisma');
    await prisma.$disconnect();
    console.log('Server closed.');
    process.exit(0);
  });
});

module.exports = app;

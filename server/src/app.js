const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const config = require('./config');
const donationRoutes = require('./routes/donationRoutes');

// Import routes
const volunteerRoutes = require('./routes/volunteerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const metricsRoutes = require('./routes/metricsRoutes');

// Import middleware
const errorHandler = require('./middleware/errorMiddleware');

const app = express();

// disable x-powered-by header for security
app.disable('x-powered-by');

// Body parser with size limit
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Security middleware
app.use(helmet());

// Compression
app.use(compression());

// Logging
if (config.app.env === 'development') {
  app.use(morgan('dev'));
}

const corsOptions = {
  origin: function (origin, callback) {
    const origins = config.cors.allowedOrigins;
    if (!origin || origins.length === 0 || origins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy: Origin not allowed'));
  },
  methods: config.cors.allowedMethods.length ? config.cors.allowedMethods : ['GET', 'POST', 'PUT', 'DELETE']
};
app.use(cors(corsOptions));
// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'NGO Backend is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/v1/volunteer', volunteerRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1', metricsRoutes);
app.use('/api/v1/donation', donationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
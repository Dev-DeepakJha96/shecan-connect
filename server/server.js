const app = require('./src/app');
const connectDB = require('./src/config/database');
const config = require('./src/config');
const mongoose = require('mongoose');

connectDB();

// Start server
const server = app.listen(config.app.port, () => {
  console.log(`🚀 Server running in ${config.app.env} mode on port ${config.app.port}`);
  console.log(`📍 API URL: http://localhost:${config.app.port}${config.app.apiPrefix}`);
});

// Graceful shutdown helpers
const shutdown = async (reason, code = 0) => {
  console.log(`Shutting down: ${reason}`);
  try {
    await mongoose.connection.close(false);
    console.log('MongoDB connection closed');
  } catch (e) {
    console.error('Error closing MongoDB connection', e);
  }
  server.close(() => process.exit(code));
};

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  shutdown('unhandledRejection', 1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  shutdown('uncaughtException', 1);
});

process.on('SIGINT', () => shutdown('SIGINT', 0));
process.on('SIGTERM', () => shutdown('SIGTERM', 0));
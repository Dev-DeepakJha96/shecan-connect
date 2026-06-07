const config = require('../config');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server Error';
  let errors = [];

  // Only log full error in development
  if (config.app.env === 'development') console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Resource not found';
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {}).join(', ');
    message = 'Duplicate field value entered';
    errors.push({ field: field || '(unknown)', message: message });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    message = 'Validation failed';
  }

  // Zod errors handled earlier in validation middleware, but normalize if present
  if (err.name === 'ZodError' && err.errors) {
    statusCode = 400;
    errors = err.errors.map(e => ({ field: e.path.join('.'), message: e.message }));
    message = 'Validation failed';
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(config.app.env === 'development' ? { stack: err.stack } : {})
  });
};

module.exports = errorHandler;
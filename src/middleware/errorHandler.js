// ============================================
// Centralized Error Handler
// ============================================

/**
 * Express error handling middleware
 * All errors flow through here - ensures consistent error response shape
 */
function errorHandler(err, req, res, next) {
  // Log error for debugging
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error:', err);
  } else {
    // In production, log to file instead of console
    console.error(`[${new Date().toISOString()}] ${err.stack}`);
  }

  // Determine status code
  const statusCode = err.statusCode || err.status || 500;

  // Build error response
  const errorResponse = {
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'An unexpected error occurred.',
    },
  };

  // Include stack trace in non-production environments
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    errorResponse.error.stack = err.stack;
  }

  // Include validation field errors if present
  if (err.fields) {
    errorResponse.error.fields = err.fields;
  }

  res.status(statusCode).json(errorResponse);
}

/**
 * Custom application error class
 */
class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', fields = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.fields = fields;
    this.name = 'AppError';
  }
}

module.exports = { errorHandler, AppError };

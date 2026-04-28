// ============================================
// Auth Middleware — JWT verification + Rate Limiting
// ============================================

const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const prisma = require('../config/prisma');

// --------------------------------------------
// Rate Limiters
// --------------------------------------------

// Login: 5 attempts per minute per IP
const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many login attempts. Please try again after 1 minute.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Registration: 10 attempts per minute per IP
const registerLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many registration attempts. Please try again after 1 minute.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Password reset: 3 attempts per minute per IP
const resetLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many password reset attempts. Please try again after 1 minute.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// --------------------------------------------
// JWT Verification
// --------------------------------------------

/**
 * Verify access token and attach user to req
 * Usage: router.get('/protected', verifyToken, handler)
 */
async function verifyToken(req, res, next) {
  try {
    // Get token from Authorization header: "Bearer <token>"
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Access token required.',
        },
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB (ensure still exists and active)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, createdAt: true },
    });

    if (!user) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not found.',
        },
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Access token has expired. Please refresh.',
        },
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid access token.',
        },
      });
    }
    // Unexpected error
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Authentication error.',
      },
    });
  }
}

// --------------------------------------------
// Refresh Token Verification
// --------------------------------------------

/**
 * Verify refresh token from HttpOnly cookie
 * Usage: router.post('/refresh', verifyRefreshToken, handler)
 */
async function verifyRefreshToken(req, res, next) {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Refresh token required.',
        },
      });
    }

    // Verify token signature
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Check if token exists in user's refreshTokens array
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, refreshTokens: true },
    });

    if (!user) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not found.',
        },
      });
    }

    if (!user.refreshTokens.includes(refreshToken)) {
      // Token reuse detected — potential attack
      // Clear all refresh tokens for this user (force logout everywhere)
      await prisma.user.update({
        where: { id: user.id },
        data: { refreshTokens: [] },
      });
      return res.status(401).json({
        error: {
          code: 'TOKEN_COMPROMISED',
          message: 'Session invalidated. Please login again.',
        },
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: {
          code: 'REFRESH_TOKEN_EXPIRED',
          message: 'Refresh token has expired. Please login again.',
        },
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid refresh token.',
        },
      });
    }
    // Unexpected error
    console.error('Refresh token error:', error);
    return res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Authentication error.',
      },
    });
  }
}

module.exports = {
  verifyToken,
  verifyRefreshToken,
  loginLimiter,
  registerLimiter,
  resetLimiter,
};

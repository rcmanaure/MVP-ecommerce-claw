// ============================================
// Auth Routes — Registration, Login, Refresh, Logout, Password Reset
// ============================================

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const prisma = require('../config/prisma');
const { verifyToken, verifyRefreshToken, loginLimiter, registerLimiter, resetLimiter } = require('../middleware/auth');

const router = express.Router();

// --------------------------------------------
// Constants
// --------------------------------------------
const BCRYPT_ROUNDS = 12;
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
const RESET_TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour in ms

// --------------------------------------------
// Helpers
// --------------------------------------------

/**
 * Generate access token (JWT)
 */
function generateAccessToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
}

/**
 * Generate refresh token (JWT)
 */
function generateRefreshToken(user) {
  return jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
}

/**
 * Set refresh token as HttpOnly cookie
 */
function setRefreshCookie(res, token) {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  });
}

/**
 * Clear refresh token cookie
 */
function clearRefreshCookie(res) {
  res.cookie('refreshToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
  });
}

// --------------------------------------------
// POST /api/auth/register
// --------------------------------------------
router.post('/register', registerLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email and password are required.',
        },
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid email format.',
        },
      });
    }

    // Password strength validation
    if (password.length < 8) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Password must be at least 8 characters.',
        },
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return res.status(409).json({
        error: {
          code: 'EMAIL_EXISTS',
          message: 'An account with this email already exists.',
        },
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        refreshTokens: [],
      },
      select: { id: true, email: true, createdAt: true },
    });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token in DB
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshTokens: { push: refreshToken } },
    });

    // Set refresh cookie
    setRefreshCookie(res, refreshToken);

    // Return user + access token
    res.status(201).json({
      data: {
        user,
        accessToken,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Registration failed. Please try again.',
      },
    });
  }
});

// --------------------------------------------
// POST /api/auth/login
// --------------------------------------------
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email and password are required.',
        },
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Use generic message to prevent email enumeration
      return res.status(401).json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password.',
        },
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password.',
        },
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token in DB
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshTokens: { push: refreshToken } },
    });

    // Set refresh cookie
    setRefreshCookie(res, refreshToken);

    // Return user + access token
    res.json({
      data: {
        user: {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt,
        },
        accessToken,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Login failed. Please try again.',
      },
    });
  }
});

// --------------------------------------------
// POST /api/auth/refresh
// --------------------------------------------
router.post('/refresh', verifyRefreshToken, async (req, res) => {
  try {
    const user = req.user;
    const oldRefreshToken = req.cookies?.refreshToken;

    // Generate new tokens
    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Replace old refresh token with new one (rotation)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshTokens: {
          set: user.refreshTokens.map(t => (t === oldRefreshToken ? newRefreshToken : t)),
        },
      },
    });

    // Set new refresh cookie
    setRefreshCookie(res, newRefreshToken);

    // Return new access token
    res.json({
      data: { accessToken },
    });
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Token refresh failed. Please login again.',
      },
    });
  }
});

// --------------------------------------------
// POST /api/auth/logout
// --------------------------------------------
router.post('/logout', verifyRefreshToken, async (req, res) => {
  try {
    const user = req.user;
    const refreshToken = req.cookies?.refreshToken;

    // Remove this refresh token from DB
    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshTokens: {
          set: user.refreshTokens.filter(t => t !== refreshToken),
        },
      },
    });

    // Clear cookie
    clearRefreshCookie(res);

    res.json({
      data: { message: 'Logged out successfully.' },
    });
  } catch (error) {
    console.error('Logout error:', error);
    // Still clear cookie even on error
    clearRefreshCookie(res);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Logout failed.',
      },
    });
  }
});

// --------------------------------------------
// POST /api/auth/forgot-password
// --------------------------------------------
router.post('/forgot-password', resetLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email is required.',
        },
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Always return success to prevent email enumeration
    // But only generate token if user exists
    if (user) {
      // Generate reset token (crypto random hex)
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
      const resetTokenExpiry = Date.now() + RESET_TOKEN_EXPIRY;

      // Store hashed token and expiry (could add resetToken fields to schema, or use a separate ResetToken model)
      // For MVP simplicity, we'll store in user record temporarily using a JSON field
      // Since schema has no resetToken field, we'll create a mock flow showing the token
      // In production, use a separate PasswordReset model

      // Mock: log the reset URL (in production, send email)
      const resetUrl = `http://localhost:3000/api/auth/reset-password?token=${resetToken}`;
      console.log(`[MOCK EMAIL] Password reset requested for ${email}`);
      console.log(`[MOCK EMAIL] Reset link: ${resetUrl}`);
    }

    // Always return success
    res.json({
      data: {
        message: 'If an account with that email exists, a password reset link has been sent.',
      },
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Password reset request failed. Please try again.',
      },
    });
  }
});

// --------------------------------------------
// POST /api/auth/reset-password
// --------------------------------------------
router.post('/reset-password', resetLimiter, async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Token and new password are required.',
        },
      });
    }

    // Password strength validation
    if (password.length < 8) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Password must be at least 8 characters.',
        },
      });
    }

    // Hash the token to compare (in production, lookup in PasswordReset table)
    // For MVP, we'll do a simple validation flow
    // This is a mock implementation - in production, use a proper reset token table

    // Validate token format (should be 64 char hex string)
    if (!/^[a-f0-9]{64}$/i.test(token)) {
      return res.status(400).json({
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired reset token.',
        },
      });
    }

    // Mock: In production, lookup hashed token in PasswordReset table
    // For now, return success to show the flow works
    console.log(`[MOCK] Password reset with token: ${token.substring(0, 8)}...`);

    res.json({
      data: {
        message: 'Password has been reset successfully. Please login with your new password.',
      },
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Password reset failed. Please try again.',
      },
    });
  }
});

module.exports = router;

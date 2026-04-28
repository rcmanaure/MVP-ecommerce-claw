// ============================================
// User Routes — Profile endpoint
// ============================================

const express = require('express');
const prisma = require('../config/prisma');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// --------------------------------------------
// GET /api/auth/me
// --------------------------------------------
router.get('/me', verifyToken, async (req, res) => {
  try {
    // req.user comes from verifyToken middleware
    const userId = req.user.id;

    // Fetch full user profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found.',
        },
      });
    }

    res.json({
      data: { user },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch user profile.',
      },
    });
  }
});

module.exports = router;

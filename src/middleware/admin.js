// ============================================
// Admin Middleware — Role-based access control
// ============================================

const prisma = require('../config/prisma');

/**
 * Middleware to check if user has admin role
 * Must be used AFTER verifyToken middleware
 */
async function requireAdmin(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required.',
        },
      });
    }

    // Fetch fresh user data to get current role
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not found.',
        },
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'Admin access required.',
        },
      });
    }

    // Attach role to request for downstream use
    req.user.role = user.role;
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Authorization error.',
      },
    });
  }
}

module.exports = { requireAdmin };
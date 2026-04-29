// ============================================
// Prisma Client Singleton
// ============================================
// Avoids multiple connections in development (hot reload)

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

module.exports = prisma;

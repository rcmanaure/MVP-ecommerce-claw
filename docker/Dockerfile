# Node.js + Express + PostgreSQL + Nginx
# Production-ready, using Debian for Prisma compatibility

# Build stage
FROM node:20 AS builder

WORKDIR /build

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev for prisma CLI)
RUN npm install

# Copy prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Production stage
FROM node:20

# Runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set work directory
WORKDIR /app

# Copy built dependencies and generated prisma client
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/node_modules/.prisma ./node_modules/.prisma

# Copy source
COPY . .

# Create directories and set ownership
RUN mkdir -p /app/public /app/logs && \
    chown -R node:node /app

# Switch to non-root user
USER node

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Start command
CMD ["node", "src/index.js"]

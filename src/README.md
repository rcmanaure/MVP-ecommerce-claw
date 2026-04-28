# Ecommerce MVP — Backend Setup

## Overview

Node.js + Express backend with JWT authentication and PostgreSQL database.

## Quick Start

### 1. Prerequisites

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15 (or use Docker)

### 2. Environment Variables

```bash
cd /mnt/Storage3/ecommerce-deployment/src
cp .env.example .env
# Edit .env and set secure JWT secrets
```

Generate secure secrets:
```bash
openssl rand -hex 64
```

### 3. Database Setup

Using Docker (recommended):

```bash
cd /mnt/Storage3/ecommerce-deployment/docker
docker compose up -d db

# Run Prisma migrations
npx prisma migrate dev --name init
```

Or locally:
```bash
# Create database
createdb ecommerce

# Run migrations
npx prisma migrate dev --name init
```

### 4. Start Server

Development:
```bash
npm install
npm run dev
```

Production (Docker):
```bash
cd /mnt/Storage3/ecommerce-deployment/docker
docker compose up -d app
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | Login (returns JWT) |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Invalidate session |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password with token |
| GET | `/api/auth/me` | Get current user |

### Products

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/products` | List products (pagination, search, filter) | Public |
| GET | `/api/products/:id` | Get single product | Public |
| POST | `/api/products` | Create product | Admin |
| PUT | `/api/products/:id` | Update product | Admin |
| DELETE | `/api/products/:id` | Delete product | Admin |

### Query Parameters (GET /api/products)

| Parameter | Default | Description |
|-----------|---------|-------------|
| `page` | 1 | Page number |
| `limit` | 20 | Items per page (max 100) |
| `search` | - | Search by name (case-insensitive) |
| `category` | - | Filter by category (exact match) |
| `minPrice` | - | Minimum price filter |
| `maxPrice` | - | Maximum price filter |

### Health Check

```
GET /health
```

## Request/Response Format

### Success
```json
{
  "data": { ... },
  "meta": { ... }
}
```

### Error
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "fields": { ... }
  }
}
```

## Authentication Flow

1. **Register/Login** → Returns `accessToken` (15min) + sets `refreshToken` HttpOnly cookie (7 days)
2. **API Calls** → Include `Authorization: Bearer <accessToken>`
3. **Token Expired** → Call `POST /api/auth/refresh` to get new access token
4. **Logout** → Call `POST /api/auth/logout` to invalidate refresh token

## Security Features

- Passwords hashed with bcrypt (12 rounds)
- Rate limiting on all auth endpoints
- JWT with short-lived access tokens
- HttpOnly refresh token cookies
- Token rotation on refresh
- Reuse detection (invalidates all sessions if compromised)

## Project Structure

```
src/
├── config/
│   └── prisma.js        # Prisma client singleton
├── middleware/
│   ├── auth.js          # JWT verification + rate limiters
│   ├── admin.js         # Admin role check middleware
│   └── errorHandler.js  # Centralized error handling
├── routes/
│   ├── auth.js          # Auth endpoints
│   ├── products.js      # Product catalog endpoints
│   └── user.js          # User profile endpoints
├── index.js            # App entry point
└── .env.example        # Environment template
```

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Get Current User
```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <access_token>"
```

## Troubleshooting

### "Connection refused" on database
- Ensure PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- For Docker: `docker compose up -d db`

### "Invalid token" errors
- Check `JWT_SECRET` matches between environments
- Access tokens expire after 15 minutes
- Refresh tokens expire after 7 days

### Rate limiting triggered
- Wait before retrying
- Login: 5 attempts/minute
- Register: 10 attempts/minute
- Password reset: 3 attempts/minute

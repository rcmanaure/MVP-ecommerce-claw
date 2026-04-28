# Ecommerce MVP — Architecture Document

**Created:** 2026-04-28
**Author:** Professor (Architecture Specialist)
**Status:** Proposed

---

## 1. Recommended Stack

| Layer | Choice | Reasoning |
|-------|--------|-----------|
| **Backend Framework** | **Node.js + Express** | Faster MVP iteration, JSON-first, easier frontend integration. Django is solid but Python adds deployment complexity for a team already in the Node ecosystem. |
| **Frontend** | **React + Vite** | Fast dev server, good component ecosystem. Aligns with login page spec (React-friendly). |
| **Database** | **PostgreSQL** | MVP scale is no excuse for SQLite. PostgreSQL handles JSON, full-text search, and scales to production. `713GB` storage available — plenty for MVP. |
| **Authentication** | **JWT (access) + HttpOnly cookie (refresh)** | Stateless API-friendly tokens. HttpOnly refresh cookie prevents XSS token theft. Sessionless for scalability. |
| **API Pattern** | **REST** | GraphQL adds complexity (schema management, caching, client overhead). For MVP scope, REST with well-designed endpoints is faster to build and debug. |

---

## 2. Folder Structure

```
ecommerce-mvp/
├── src/
│   ├── config/            # Environment, DB connection
│   ├── middleware/        # auth, validation, error handling
│   ├── models/            # Sequelize or Prisma schemas
│   ├── routes/            # Express routers by resource
│   ├── controllers/        # Request handlers
│   ├── services/          # Business logic (separate from controllers)
│   ├── utils/             # Helpers, constants
│   └── index.js           # App entry point
├── public/                # Static assets, built frontend
├── tests/                 # Jest or Vitest unit/integration tests
├── migrations/            # DB migrations
├── .env.example           # Environment variable template
├── package.json
└── README.md
```

**Key principle:** Services layer isolates business logic from HTTP layer (controllers). This makes testing easier.

---

## 3. API Patterns

### REST Endpoints (MVP Scope)

```
Auth:
  POST   /api/auth/register
  POST   /api/auth/login
  POST   /api/auth/logout
  POST   /api/auth/refresh
  GET    /api/auth/me

Products:
  GET    /api/products           # List with pagination, filters
  GET    /api/products/:id       # Single product
  POST   /api/products           # Create (admin)
  PUT    /api/products/:id       # Update (admin)
  DELETE /api/products/:id       # Delete (admin)

Cart:
  GET    /api/cart
  POST   /api/cart/items
  PUT    /api/cart/items/:id
  DELETE /api/cart/items/:id

Orders:
  GET    /api/orders
  GET    /api/orders/:id
  POST   /api/orders
```

### Request/Response Shape

```json
// Success
{ "data": { ... }, "meta": { "pagination": {...} } }

// Error
{ "error": { "code": "VALIDATION_ERROR", "message": "...", "fields": {...} } }
```

### Versioning
`/api/v1/` prefix — MVP can omit but plan for it.

---

## 4. Authentication Approach

### JWT + Refresh Token Pattern

```
Login Flow:
1. User submits email + password
2. Server validates → generates:
   - Access token (15min, JWT, contains userId, role)
   - Refresh token (7 days, opaque, stored in DB)
3. Access token returned in response body
4. Refresh token set as HttpOnly, Secure, SameSite=Strict cookie

Refresh Flow:
1. Client detects 401 → calls POST /api/auth/refresh
2. Server reads refresh token from cookie, validates against DB
3. Issues new access token
4. If refresh token expired/ revoked → logout
```

### Password Storage
`bcrypt` with cost factor 12 (password hashing is one-time, use strong defaults).

### Social Auth (OAuth)
Deferred to post-MVP. Login spec shows social buttons but OAuth integration requires provider setup, callback infrastructure, and token management. MVP ships email/password only.

---

## 5. Critical Architectural Decisions

### Decision 1: Prisma ORM over Sequelize or raw SQL

**Choice:** Prisma with PostgreSQL

**Reasoning:**
- Type-safe schema → catches bugs at build time
- Auto-generated client eliminates boilerplate
- Migration system is first-class
- For MVP, Prisma's DX pays off more than Sequelize's flexibility

**Tradeoff:** Prisma adds runtime overhead vs raw `pg`. Acceptable for MVP.

---

### Decision 2: Stateless API with JWT

**Choice:** JWT access tokens + DB-backed refresh tokens

**Reasoning:**
- Horizontal scaling: any server can validate JWT (no shared session store needed)
- Refresh token rotation adds security (token reuse detection)
- HttpOnly cookie prevents XSS token theft

**Tradeoff:** Token revocation isn't instant (short token lifetime mitigates). If instant revocation needed post-MVP, add Redis token blocklist.

---

### Decision 3: Monolith for MVP, Modular Structure

**Choice:** Single Node.js process, organized by feature (routes/controllers/services)

**Reasoning:**
- MVP doesn't need microservices overhead (separate deployments, inter-service comms)
- Modular structure allows easy extraction if/when scale demands it
- Simpler local development and CI/CD

**Tradeoff:** If one process crashes, entire app goes down. For MVP traffic levels, acceptable.

---

### Decision 4: Environment-Based Configuration

**Choice:** `.env` files with validation at startup (Joi or Zod)

**Reasoning:**
- No hardcoded secrets in source control
- Different configs for dev/staging/prod
- Startup validation prevents silent misconfigurations

**Required env vars:**
```
DATABASE_URL
JWT_SECRET
JWT_REFRESH_SECRET
NODE_ENV
PORT
```

---

### Decision 5: Centralized Error Handling

**Choice:** Express middleware that catches all errors and returns consistent shape

```javascript
// All errors → consistent shape
{ error: { code: "...", message: "...", stack: env !== production" } }
```

**Reasoning:**
- Frontend can always parse error responses
- Logging centralized
- No scattered try/catch in controllers

---

## 6. Items Flagged from Login Page Spec

| Issue | Description |
|-------|-------------|
| **Social Auth Deferred** | Login spec shows Google/GitHub/Discord buttons. OAuth requires callback infrastructure and token handling. MVP should ship email/password only — social auth is post-MVP. |
| **No Session Management** | Spec doesn't define session lifecycle. We've defined: access token 15min, refresh 7 days, rotation on use. |
| **"Remember Me" Unclear** | The checkbox implies extended session. We implement: extended refresh token TTL (30 days) when checked. |
| **Forgot Password Flow Missing** | Link exists in spec but no flow defined. MVP scope should include email-based password reset. |
| **No Rate Limiting** | Login endpoint is a brute-force target. MVP must include rate limiting (e.g., 5 attempts/minute per IP). |

---

## 7. MVP Scope Recommendation

Based on login page spec, recommend MVP includes:

| Feature | Priority |
|---------|----------|
| User registration + email verification | Must have |
| User login with JWT | Must have |
| Product listing + detail pages | Must have |
| Shopping cart (session-persisted) | Must have |
| Checkout + order creation | Must have |
| Password reset | Must have |
| Rate limiting on auth endpoints | Must have |
| Social auth (Google) | Post-MVP |
| Admin product management | Post-MVP |

---

## 8. Deployment Notes

- Storage: `713GB` available at `/mnt/Storage3/` — more than sufficient
- Recommend Docker for consistent dev/prod parity
- Database: Run PostgreSQL in container or bare metal on Storage3
- Frontend: Can be served by Express in same process (static middleware)

---

**Next Step:** Proceed to detailed spec for products/cart modules, or await Boss approval on this architecture.

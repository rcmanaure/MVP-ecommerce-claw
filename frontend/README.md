# Ecommerce MVP — Frontend

React 18 + Vite frontend for authentication and product catalog pages.

## Setup

```bash
npm install
npm run dev
```

## Pages

### Authentication
- `/login` — Login page
- `/register` — Registration page
- `/forgot-password` — Request password reset
- `/reset-password` — Reset password with token

### Product Catalog
- `/products` — Product listing with grid, filters, search, pagination
- `/products/:id` — Product detail with image gallery

## Design Tokens

All colors and spacing defined in `src/styles/tokens.css`.

| Token | Value | Usage |
|---|---|---|
| `--bg-page` | `#0f172a` | Page background |
| `--bg-card` | `#1e293b` | Card surface |
| `--accent` | `#3b82f6` | Primary button, links |
| `--accent-hover` | `#2563eb` | Button hover |
| `--error` | `#ef4444` | Validation errors |
| `--success` | `#22c55e` | Success states |

## API Integration

### Auth Service
`src/services/auth.js` — currently mocked.

Production endpoints:
- POST `/api/auth/login`
- POST `/api/auth/register`
- POST `/api/auth/forgot-password`
- POST `/api/auth/reset-password`

### Products Service
`src/services/products.js` — currently mocked.

Endpoints:
- GET `/api/products` — List with pagination, search, filters
- GET `/api/products/:id` — Single product

Query params: `page`, `limit`, `search`, `category`, `minPrice`, `maxPrice`

All API calls go through nginx to backend.

## JWT Handling

**No localStorage JWT** — production uses httpOnly cookies only.

## Components

### Auth Components
- `TextInput` — email, password inputs with validation
- `Button` — primary/secondary variants with loading state
- `Checkbox` — remember me, terms agreement
- `Alert` — error/success messages
- `Spinner` — loading indicator
- `SocialButtons` — Google/GitHub/Discord (mock, disabled)

### Product Components
- `ProductCard` — product grid item with image, name, price, add to cart
- `FilterSidebar` — search, category, price range filters
- `Pagination` — page navigation with ellipsis

## Responsive Grid

Product grid adapts to screen size:
- Mobile (<480px): 1 column
- Tablet (480-768px): 2 columns
- Desktop (768-1024px): 2 columns
- Large (1024-1280px): 3 columns
- XL (1280px+): 4 columns
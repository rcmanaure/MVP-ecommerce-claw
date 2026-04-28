# Ecommerce MVP — Docker Setup (Node.js + Express)

## Stack
- **Runtime:** Node.js 20 Alpine
- **Database:** PostgreSQL 15 Alpine
- **Web Server:** Nginx Alpine
- **Port:** 80 (HTTP), 443 (HTTPS)

## Quick Start

```bash
cd /mnt/Storage3/ecommerce-deployment

# Build and start
docker compose build
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs -f app
```

## Environment Variables

Create `.env` in project root:

```env
NODE_ENV=production
PORT=3000
DB_NAME=ecommerce
DB_USER=ecommerce
DB_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| app | 3000 | Node.js Express server |
| db | 5432 | PostgreSQL database |
| nginx | 80 | Reverse proxy + static files |

## Volumes

| Path | Description |
|------|-------------|
| `/mnt/Storage3/ecommerce-deployment/data/postgres` | PostgreSQL data |
| `/mnt/Storage3/ecommerce-deployment/data/static` | Static files |
| `/mnt/Storage3/ecommerce-deployment/data/media` | User uploads |
| `/mnt/Storage3/ecommerce-deployment/logs` | App + Nginx logs |

## Troubleshooting

```bash
# Restart services
docker compose restart

# Rebuild after code changes
docker compose build --no-cache app
docker compose up -d

# Connect to database
docker exec -it ecommerce-db psql -U ecommerce -d ecommerce

# Check container logs
docker compose logs db
docker compose logs app
docker compose logs nginx
```

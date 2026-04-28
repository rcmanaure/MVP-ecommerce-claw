# Ecommerce MVP

Plataforma ecommerce fullstack — Django + PostgreSQL + React.

## Stack

| Capa | Tecnología |
|---|---|
| Backend | Django 5 + Django REST Framework |
| Frontend | React 18 + Vite |
| Database | PostgreSQL 16 |
| Proxy | Nginx |
| Deploy | Docker + Docker Compose |

## Repositorio Autorizado

Este repositorio fue creado por Boss y es el único repo externo autorizado para el equipo Planet Express.

**Owner:** rcmanaure  
**URL:** https://github.com/rcmanaure/MVP-ecommerce-claw

## Estructura

```
.
├── backend/           # Django API
├── frontend/          # React app
├── docker/            # Docker config
├── nginx/             # Nginx reverse proxy
└── docker-compose.yml # Orquestación
```

## Quick Start (desarrollo)

```bash
# Clonar
git clone https://github.com/rcmanaure/MVP-ecommerce-claw.git
cd MVP-ecommerce-claw

# Levantar entorno
cd docker
docker-compose -f docker-compose.dev.yml up --build -d

# URLs
- App: http://localhost
- API: http://localhost/api/
- Admin: http://localhost/admin/
```

## Deploy (producción)

```bash
cd docker
docker-compose up --build -d
```

## CI/CD

GitHub Actions ejecuta tests y build en cada push a `develop` y `main`.

## Equipo

- **Calculon** — Backend (Django)
- **Leela** — Backend (Node/TypeScript)
- **Kif** — Frontend (React)
- **Scruffy** — DevOps / Docker
- **Fry** — QA / Testing

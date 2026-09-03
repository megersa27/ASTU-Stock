# ASTU Stock Management System

A web-based stock management system for inventory, stock movement, reporting, and user management.

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: PostgreSQL
- ORM: Prisma
- Container support: Docker Compose

## Prerequisites

- Node.js 20+
- npm
- PostgreSQL 16+
- Git

## Local setup

1. Clone the project and open the root folder.
2. Create the backend and frontend environment files if needed.
3. Start PostgreSQL and set the connection string in [backend/.env](backend/.env).
4. Install dependencies.

### Install dependencies

```bash
npm install
npm --prefix backend install
npm --prefix frontend install
```

### Backend environment

Update [backend/.env](backend/.env) with your local database values:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/astu_stock_db"
JWT_SECRET="your_secure_secret"
PORT=5000
```

### Frontend environment

Update [frontend/.env](frontend/.env):

```env
VITE_API_URL=http://localhost:5000/api
```

## Run the app

### Option 1: Run both at once

```bash
npm run dev
```

This starts:

- Backend: http://localhost:5000
- Frontend: http://localhost:5173

### Option 2: Run separately

```bash
npm run dev:backend
npm run dev:frontend
```

## Build for production

```bash
npm run build
```

## Database setup

Generate Prisma client and apply migrations:

```bash
npm --prefix backend run prisma:generate
npm --prefix backend run prisma:migrate
```

## Docker database option

A Postgres service is available through Docker Compose. The host port is mapped to 5433 to avoid conflicts with any existing local PostgreSQL instance already running on port 5432.

```bash
docker compose up -d db
```

If you use the Docker database, update the backend connection string to:

```env
DATABASE_URL="postgresql://astu_stock_user:astu_stock@localhost:5433/astu_stock_db"
```

The project is designed for a typical local development workflow and can be extended for staging or production deployment.

## Project phases

- Phase 0 — Product Planning
- Phase 1 — Software Requirements Specification
- Phase 2 — Software Architecture Design
- Phase 3 — UI/UX Design
- Phase 4 — Environment Setup

# User Management App

A simple CRUD application built with Next.js 16, PostgreSQL, Tailwind CSS and Docker Containerization.

## Features

- Create, Read, Update, and Delete users
- Form validation with Zod
- PostgreSQL database with Docker
- Next.js Server Actions
- Tailwind CSS styling
- Health checks for database

## Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- npm or yarn

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

The `.env` file is already created with default credentials:
- Database: `{DB_NAME}`
- User: `{DB_USER}`
- Password: `{DB_PASS}`
- Port: `5432`

### 3. Start the PostgreSQL database

```bash
docker compose -f database-compose.yaml up -d
```

Wait for the database to be healthy (you can check with `docker ps`).

### 4. Run database migrations

```bash
npm run migrate
```

This will create the `users` table in the database.

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── actions.ts          # Server Actions for CRUD operations
│   ├── page.tsx            # Main page (server component)
│   └── UserForm.tsx        # Client component for the UI
├── lib/
│   ├── db.ts              # Database connection
│   └── schemas.ts         # Zod validation schemas
├── scripts/
│   └── migrate.ts         # Database migration script
├── database-compose.yaml   # Docker Compose for PostgreSQL
└── .env                   # Environment variables
```

## Database Schema

The `users` table has the following structure:

- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR(255) NOT NULL)
- `email` (VARCHAR(255) NOT NULL UNIQUE)
- `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run lint` - Run ESLint

## Docker Commands

- Start database: `docker compose -f database-compose.yaml up -d`
- Stop database: `docker compose -f database-compose.yaml down`
- View logs: `docker compose -f database-compose.yaml logs -f`
- Remove volumes: `docker compose -f database-compose.yaml down -v`

## Tech Stack

- **Framework:** Next.js 16
- **Database:** PostgreSQL 16
- **Styling:** Tailwind CSS 4
- **Validation:** Zod
- **Database Client:** node-postgres (pg)
- **TypeScript:** 5.x


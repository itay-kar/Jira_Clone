# Jira Clone

A self-hostable Jira-style workspace for small software teams. The project is
being built with a TypeScript/Express backend, Prisma, PostgreSQL, and a React
frontend.

## Current Status

The backend foundation is in place, including the Prisma schema, initial
migration, and `/health` endpoint. Authentication, project workflows, tickets,
and the frontend are planned next; see
[`docs/jira-clone-task-breakdown.md`](docs/jira-clone-task-breakdown.md).

## Prerequisites

- Node.js 20 or newer
- npm
- Docker with Docker Compose

## Run Locally

1. Start PostgreSQL:

   ```sh
   docker compose up -d postgres
   ```

2. Set the backend database URL:

   ```sh
   cd backend
   printf 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/jira_clone"\n' > .env
   ```

3. Install dependencies, apply migrations, and start the backend:

   ```sh
   npm install
   npx prisma migrate dev
   npm run dev
   ```

4. Verify the API at [`http://localhost:4000/health`](http://localhost:4000/health).

## Repository Layout

- `backend/` - Express API, Prisma schema, and database migrations
- `frontend/` - React application (planned)
- `docs/` - Project brief, API contract, ER diagram, and task breakdown
- `docker-compose.yml` - Local PostgreSQL service

## License

This project is currently unlicensed.

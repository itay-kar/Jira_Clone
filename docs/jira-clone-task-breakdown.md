# Jira Clone — Task Breakdown (v1)

Stack: Node.js + TypeScript + Express/NestJS, Prisma, PostgreSQL, React + TS + Vite, Socket.IO, Docker, GitHub Actions

Each task is scoped to roughly 1–3 hours. Check them off as you go.

## Phase 0 — Planning & Setup
- [x] Write a 1-page project brief (problem, users, core features, out-of-scope)
- [x] Design the ER diagram (User, Project, ProjectMember, Board, Column, Ticket, Comment, Label)
- [x] Define REST API contract (endpoints, request/response shapes) in a markdown doc or Swagger stub
- [x] Set up monorepo structure (`/backend`, `/frontend`, `/docs`)
- [x] Init git repo, add `.gitignore`, README skeleton
- [x] Set up ESLint + Prettier for both frontend and backend

## Phase 1 — Backend Foundation
- [x] Init Node + TypeScript project, configure `tsconfig.json`
- [x] Set up Express or NestJS app skeleton with a health-check route
- [x] Set up PostgreSQL locally (Docker container)
- [x] Set up Prisma, define initial schema (User, Project)
- [x] Run first migration, verify DB connection
- [x] Add environment config (`.env`, config module)
- [X] Set up basic error-handling middleware and logging (e.g. pino/winston)

## Phase 2 — Auth
- [X] User model: email, password hash, name
- [X] Register endpoint (hash password with bcrypt)
- [X] Login endpoint (issue JWT)
- [X] Auth middleware (verify JWT, attach user to request)
- [X] Role/permission model (Admin vs Member per project)
- [ ] Basic tests for auth flow

## Phase 3 — Projects & Boards (Backend)
- [X] Project model + CRUD endpoints (create/list/get/update/delete)
- [X] ProjectMember model (invite/add users to a project)
- [X] Board model (each project has one default board, or supports multiple)
- [X] Column model (To Do / In Progress / Done, reorderable)
- [ ] Seed script with realistic fake data (use `@faker-js/faker`)

## Phase 4 — Tickets (Backend)
- [X] Ticket model (title, description, type, priority, assignee, status/column, labels)
- [X] CRUD endpoints for tickets
- [X] Comment model + endpoints (add/list comments on a ticket)
- [X] Label model + endpoints
- [X] Endpoint for moving a ticket between columns (updates order/position)
- [X] Filtering/search endpoint (by assignee, label, status)

## Phase 5 — Frontend Foundation
- [X] Init Vite + React + TypeScript project
- [X] Set up Tailwind
- [X] Set up routing (React Router): login, project list, board view
- [X] Set up API client (axios/fetch wrapper) with auth token handling
- [X] Set up global state (React Query for server state; Zustand/Context for UI state)
- [X] Login/Register pages wired to backend

## Phase 6 — Project & Board UI
- [X] Project list page (create/select project)
- [X] Board page layout (columns rendered from API data)
- [X] Ticket card component (shows title, assignee avatar, labels, priority)
- [X] Create/edit ticket modal or side panel
- [X] Ticket detail view (description, comments, activity)

## Phase 7 — Drag & Drop
- [X] Integrate dnd-kit for column/card dragging
- [X] On drop, call API to persist new column/position
- [X] Optimistic UI update, rollback on failure
- [X] Handle reordering within the same column

## Phase 8 — Real-Time Sync
- [X] Set up Socket.IO server (attach to Express/NestJS)
- [X] Emit event when a ticket moves/updates
- [X] Frontend: connect to socket, listen for updates, patch local state
- [X] Test with two browser sessions to confirm live sync

## Phase 9 — Search, Filters, Polish Features
- [ ] Filter bar (by assignee, label, priority) on the board
- [ ] Global search across tickets
- [ ] Basic activity log per ticket (who changed what, when)
- [ ] (Stretch) Sprints/backlog view

## Phase 10 — Testing
- [ ] Unit tests for backend services (Jest)
- [ ] Integration tests for key API routes (auth, ticket CRUD, move ticket)
- [ ] Basic frontend component tests (React Testing Library) for critical flows

## Phase 11 — DevOps & Deployment
- [ ] Dockerfile for backend, Dockerfile for frontend
- [ ] `docker-compose.yml` (backend + frontend + Postgres + Redis)
- [ ] GitHub Actions workflow: lint + test on PR
- [ ] GitHub Actions workflow: build & push Docker images on merge to main
- [ ] Deploy to a free-tier host (Render/Railway/Fly.io) or a small VPS
- [ ] (Stretch) Kubernetes manifests or Helm chart for a "production-style" deploy

## Phase 12 — Documentation & Presentation
- [ ] Write full README (setup instructions, architecture diagram, screenshots/GIF of drag-and-drop + real-time sync)
- [ ] Write a short "system design" doc: schema, API contract, scaling notes (caching, indexing, read replicas)
- [ ] Record a 2–3 min demo video/GIF for your portfolio site or LinkedIn
- [ ] Deploy a live demo link if possible — recruiters click far more often when there's a live link

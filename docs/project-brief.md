# Jira Clone - Project Brief

## Problem

Small software teams need a shared place to turn work requests and bugs into
trackable, prioritized tasks. Existing project-management tools can be too
complex for a small team or too disconnected from the development workflow.
This project will provide a focused, self-hostable Jira-style workspace for
planning work and seeing its progress at a glance.

## Users

- **Project admins:** create projects, manage members, configure the board, and
  maintain labels.
- **Project members:** create and update tickets, assign work, move tickets
  through the workflow, and discuss implementation in comments.

## Core Features

1. **Authentication and authorization:** users can register and log in; project
   membership distinguishes admins from regular members.
2. **Projects and boards:** an authenticated user can create and manage
   projects. Each project has a default board with ordered workflow columns such
   as To Do, In Progress, and Done.
3. **Ticket management:** members can create, view, edit, delete, assign, and
   prioritize tickets. Tickets support task, bug, and story types, descriptions,
   labels, and stable project keys such as `ENG-123`.
4. **Workflow management:** users can drag tickets between columns and reorder
   them within a column. Changes are persisted through the API.
5. **Collaboration:** users can add comments to tickets and see updates from
   other active users in near real time.
6. **Finding work:** the board supports filtering by assignee, label, priority,
   and status, plus search across project tickets.

## MVP Boundaries

The first release will support one board per project, a web interface, REST
endpoints, PostgreSQL persistence, JWT authentication, and real-time ticket
updates with Socket.IO. It will include responsive board, project, login, and
ticket-detail views, but it will favor a reliable core workflow over extensive
customization.

## Out of Scope

- Sprints, backlog planning, story points, and Agile reports
- Time tracking, calendars, notifications, email, and file attachments
- OAuth or enterprise SSO
- Custom workflows and multiple boards per project
- Mobile-native applications
- Advanced analytics, audit history, and production-scale multi-region
  infrastructure

## Success Criteria

A new user can register, create a project, add or invite a member, create a
ticket, assign and label it, move it across the board, comment on it, and see
the change reflected in a second browser session. The project should be easy to
run locally with Docker, covered by tests for authentication and core ticket
operations, and documented well enough for another developer to set it up.

## Technical Direction

The application will use a TypeScript Node.js backend with Express or NestJS,
Prisma, and PostgreSQL, plus a React, TypeScript, and Vite frontend. Socket.IO
will provide live updates, dnd-kit will support board interactions, and Docker
and GitHub Actions will support repeatable development and CI workflows.
# Jira Clone - Entity Relationship Diagram

The diagram below describes the initial relational model for the MVP. It is
kept in sync with the root `schema.prisma` file.

```mermaid
erDiagram
    USER ||--o{ PROJECT : owns
    USER ||--o{ PROJECT_MEMBER : joins
    PROJECT ||--o{ PROJECT_MEMBER : has
    PROJECT ||--o| BOARD : contains
    BOARD ||--o{ COLUMN : has
    PROJECT ||--o{ TICKET : contains
    COLUMN ||--o{ TICKET : holds
    USER o|--o{ TICKET : assigned
    TICKET ||--o{ COMMENT : has
    USER ||--o{ COMMENT : writes
    PROJECT ||--o{ LABEL : defines
    TICKET ||--o{ TICKET_LABEL : uses
    LABEL ||--o{ TICKET_LABEL : tags

    USER {
        string id PK
        string email UK
        string passwordHash
        string name
        datetime createdAt
        datetime updatedAt
    }

    PROJECT {
        string id PK
        string name
        string key UK
        string ownerId FK
        datetime createdAt
        datetime updatedAt
    }

    PROJECT_MEMBER {
        string id PK
        string projectId FK
        string userId FK
        enum role
        datetime createdAt
    }

    BOARD {
        string id PK
        string projectId FK_UK
        string name
        datetime createdAt
    }

    COLUMN {
        string id PK
        string boardId FK
        string name
        int order
    }

    TICKET {
        string id PK
        string projectId FK
        string columnId FK
        string title
        string description
        enum type
        enum priority
        string assigneeId FK
        int order
        datetime createdAt
        datetime updatedAt
    }

    COMMENT {
        string id PK
        string ticketId FK
        string authorId FK
        string body
        datetime createdAt
    }

    LABEL {
        string id PK
        string projectId FK
        string name
        string color
    }

    TICKET_LABEL {
        string ticketId PK_FK
        string labelId PK_FK
    }
```

## Relationship Rules

- A user owns zero or more projects. Every project has exactly one owner.
- A user can belong to many projects, and a project can have many users. The
  `PROJECT_MEMBER` pair is unique, with one `role` (`ADMIN` or `MEMBER`) per
  project membership.
- A project has at most one board in the MVP. A board contains ordered columns;
  columns contain ordered tickets.
- Every ticket belongs to both a project and a column. Assignment is optional,
  so an unassigned ticket is valid.
- A ticket can have many comments, and every comment has one author. Deleting a
  ticket deletes its comments.
- Labels belong to a project. Tickets and labels have a many-to-many
  relationship resolved by `TICKET_LABEL`, whose composite primary key prevents
  duplicate labels on one ticket.
- Project-owned board data, tickets, comments, labels, and membership records
  use cascade deletion where defined in the Prisma schema.

## Integrity Constraints

- `USER.email`, `PROJECT.key`, and `BOARD.projectId` are unique.
- `PROJECT_MEMBER(projectId, userId)` is unique.
- `LABEL(projectId, name)` is unique.
- `TICKET_LABEL(ticketId, labelId)` is the composite primary key.
- `COLUMN.order` controls left-to-right board order; `TICKET.order` controls
  position within a column.

## Design Decisions

The model uses an explicit `TICKET_LABEL` join table instead of an implicit
many-to-many relation so metadata such as `addedAt` or `addedBy` can be added
later without redesigning the relationship. The project currently has one
default board, while the optional board relation leaves room to support a
future migration to multiple boards.
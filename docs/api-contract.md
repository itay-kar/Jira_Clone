# API Contract (v1)

Base path: `/v1`
Auth: JWT in `Authorization: Bearer <token>` header (except register/login)
Errors: consistent envelope `{ "error": { "code": "...", "message": "..." } }`
Pagination: list endpoints support `?page=&limit=`

| Resource | Method | Endpoint | Notes |
|---|---|---|---|
| Auth | POST | `/v1/auth/register` | `{email, password, name}` |
| Auth | POST | `/v1/auth/login` | Returns JWT |
| Projects | GET | `/v1/projects` | List projects the user is a member of |
| Projects | POST | `/v1/projects` | `{name, key}` |
| Projects | GET | `/v1/projects/:id` | |
| Projects | PATCH | `/v1/projects/:id` | Admin only |
| Members | POST | `/v1/projects/:id/members` | `{userId, role}` |
| Board | GET | `/v1/projects/:id/board` | Returns columns + tickets |
| Tickets | POST | `/v1/projects/:id/tickets` | |
| Tickets | GET | `/v1/tickets/:id` | Includes comments |
| Tickets | PATCH | `/v1/tickets/:id` | Field updates |
| Tickets | PATCH | `/v1/tickets/:id/move` | `{columnId, order}` — the drag-drop endpoint |
| Comments | POST | `/v1/tickets/:id/comments` | |
| Labels | GET/POST | `/v1/projects/:id/labels` | |

## Status codes

- `200 OK`, `201 Created`, `204 No Content`
- `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`
- `409 Conflict`, `422 Unprocessable Entity`, `500 Internal Server Error`

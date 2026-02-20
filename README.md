# Community Library & Literacy API (Checkpoint 2)

Backend API built with Node.js, Express, and Microsoft SQL Server.
Checkpoint 2 scope: **Auth (JWT + RBAC) + Books CRUD + Loans (borrow/list/return)**.

## Setup Instructions

1. **Database Setup (SQL Server):**
   - Run `create_tables.sql` (creates DB + tables: Users, Books, Loans + sample data).

2. **Environment Configuration:**
   - Copy `.env.example` to `.env` and fill in your SQL Server password and JWT secret.

3. **Install Dependencies:**

   ```bash
   npm install
   ```

4. **Run the Server:**
   ```bash
   npm run dev
   ```

The server will run on port 3000.

## API Endpoints

### Authentication

- Member/Librarian:
  - `POST /auth/register` - Register a new user (body: `{username, password, role}`)
  - `POST /auth/login` - Login (body: `{username, password}`) - Returns JWT token
- Librarian:
  - `GET /auth/users` - Retrieve a list of all users - optional filters: role, username
    - Query Params: `role` (e.g., `?role=member`), `username` (partial match, e.g., `?username=test`).
    - Headers: `Authorization: Bearer <token>`
    - Response: 200 OK with user list (e.g., `[{"user_id": 1, "username": "member1", "role": "member"}]`).
    - Errors: 401 (unauthorized), 403 (not librarian), 500 (server error).
  - `GET /auth/users/:userId`
  - `PUT /auth/users/:userId/role` body: `{ role }`
  - `DELETE /auth/users/:userId`

### Books (JWT required)

- Member/Librarian:
  - `GET /books` - list books and supports `?page&limit&sort=title|author|book_id&availability=Y|N&title=...&author=...`
  - `GET /books/:bookId` - get single book
- Librarian only:
  - `POST /books` - create book
  - `PUT /books/:bookId` - update book
  - `DELETE /books/:bookId` - delete book
  - `PUT /books/:bookId/availability` - update availability

### Loans (JWT required)

- Member/Librarian:
  - `POST /loans` - borrow a book (member borrows for self) or librarian (can specify `userId`)
  - `GET /loans` - list loans (member sees own; librarian sees all) and supports `?page&limit&sort=loan_id|loan_date|due_date|status&status=...`
  - `GET /loans/:loanId` — member if own; librarian any
- Librarian only:
  - `PUT /loans/:loanId/return` - return a loan (also sets book availability back to 'Y')
  - `DELETE /loans/:loanId`

### External (Open Library)

- `GET /external/books` — JWT required; query by `title`, `author`, or `isbn`; proxy to Open Library Search API.

## Frontend (Simple HTML)

- Served from `public/index.html` (via `express.static("public")`).
- Lets you: register, login, list/filter/paginate books, borrow/return/delete loans, and search Open Library (with covers).

## Logging & Error Handling

- Morgan + Winston with timestamps; audit logs to `combined.log`, errors to `error.log`.
- Global error handler returns JSON `{ error: "Something went wrong" }`.

## Testing

- Jest tests for controllers: `npm test`

## Sample Users (from create_tables.sql)

- librarian1 / P@ssw0rd123
- member1 / P@ssw0rd123

## Technologies Used

- Node.js
- Express
- MSSQL
- bcryptjs
- jsonwebtoken

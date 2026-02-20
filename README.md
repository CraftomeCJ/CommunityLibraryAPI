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
   npm run dev # nodemon
   ```

The server will run on port 3000.

## API Documentation (Swagger)

- Swagger UI: `GET /docs`
- Raw spec (for Bruno/Postman): `GET /openapi.json`

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

## How to Run Tests

```bash
npm test
```

(Jest + supertest with mocked models/controllers.)

## Sample Users (from create_tables.sql)

- `librarian10` / `123`
- `member10` / `123`

## Technologies Used

- Node.js
- Express
- MSSQL
- bcryptjs
- jsonwebtoken

## Reflection
Looking back on my practical journey, I started from the ground up with Practical 01, building basic Node.js apps and getting used to Express. Each practical built on the last one, adding stuff like databases in Practical 03, MVC patterns in Practical 04, and more complex stuff. By Practical 07, I had a decent base with the PolytechnicLibraryAPI, which had some user and book management.

For the assignment, I took that foundation and expanded it a lot. Added proper authentication using JWT tokens, with role-based access so members and librarians have different permissions. Implemented full CRUD operations for books and loans, including borrowing books and returning them. Integrated Swagger for API documentation, which was a bit of a headache at first but now lets me see all the routes clearly. Wrote unit tests with Jest and supertest, which caught mistakes early on with lots of failing test cases. Couldn't get them to work at first, until I finally figured it out. Even built a simple HTML frontend to test the API directly without needing extra tools.

The biggest challenges were definitely JWT authentication and SQL queries – I had so many errors with tokens not working and database joins messing up. Debugging those took a while, but each time I fixed something, I felt more confident. Setting up the MSSQL database and making sure everything was secure was tricky too.

As a system engineer with some backend experience, I can see how this project mirrors real-world apps. From simple endpoints to a full API with auth, tests, and docs. I still got a lot to learn, like better error handling, performance optimization, or maybe adding more features, but I'm proud of how far I came. Feels good to have an end-to-end working system.

## Credits
- Practical 07 code as base to continue this assignment.
- GenAI help (ChatGPT/Copilot) for guides on controllers, tests, Swagger, and frontend.
- Open Library API for external book search.
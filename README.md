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

## API Endpoints (Checkpoint 2)

### Authentication
- `POST /auth/register` - Register a new user (body: {username, password, role})
- `POST /auth/login` - Login (body: {username, password}) - Returns JWT token

### Books
All require JWT.
- Member/Librarian:
  - `GET /books` - list books
  - `GET /books/:bookId` - get single book
- Librarian only:
  - `POST /books` - create book
  - `PUT /books/:bookId` - update book
  - `DELETE /books/:bookId` - delete book
  - `PUT /books/:bookId/availability` - update availability (kept from Practical07)

### Loans
All require JWT.
- Member/Librarian:
  - `POST /loans` - borrow a book (member borrows for self)
  - `GET /loans` - list loans (member sees own; librarian sees all)
- Librarian only:
  - `PUT /loans/:loanId/return` - return a loan (also sets book availability back to 'Y')

## Sample Users (from create_tables.sql)
- librarian1 / P@ssw0rd123
- member1 / P@ssw0rd123

## Technologies Used
- Node.js
- Express
- MSSQL
- bcryptjs
- jsonwebtoken
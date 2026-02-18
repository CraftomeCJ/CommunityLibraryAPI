/*
Database script (SQL Server)
Creates DB + tables (Users, Books, Loans) with sample data
*/

IF DB_ID('CommunityLibrary') IS NULL
BEGIN
  CREATE DATABASE CommunityLibrary;
END
GO

CREATE LOGIN admin WITH PASSWORD = 'yourSecureP@ssw0rd123!';
GO

USE CommunityLibrary;
GO

-- Drop in correct dependency order
IF OBJECT_ID('dbo.Loans', 'U') IS NOT NULL DROP TABLE dbo.Loans;
IF OBJECT_ID('dbo.Books', 'U') IS NOT NULL DROP TABLE dbo.Books;
IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL DROP TABLE dbo.Users;
GO

-- Users table
CREATE TABLE dbo.Users (
  user_id INT IDENTITY(1,1) PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('member', 'librarian'))
);
GO

-- Books table
CREATE TABLE dbo.Books (
  book_id INT IDENTITY(1,1) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  availability CHAR(1) NOT NULL CHECK (availability IN ('Y', 'N'))
);
GO

-- Loans table (links Users ↔ Books)
CREATE TABLE dbo.Loans (
  loan_id INT IDENTITY(1,1) PRIMARY KEY,
  user_id INT NOT NULL,
  book_id INT NOT NULL,
  loan_date DATETIME NOT NULL DEFAULT GETDATE(),
  due_date DATE NOT NULL,
  returned_date DATETIME NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('BORROWED', 'RETURNED')),
  CONSTRAINT FK_Loans_Users FOREIGN KEY (user_id) REFERENCES dbo.Users(user_id),
  CONSTRAINT FK_Loans_Books FOREIGN KEY (book_id) REFERENCES dbo.Books(book_id)
);
GO

/*
Sample data
Known passwords for both users: P@ssw0rd123
The hash below is bcrypt (10 rounds) for P@ssw0rd123
*/
INSERT INTO dbo.Users (username, passwordHash, role) VALUES
  ('librarian1', '$2b$10$HI5CM8v7A.MJyscwxiYCxO1Lc92EV6/HXcnxuovJboZbtkoWJGoPq', 'librarian'),
  ('member1',    '$2b$10$HI5CM8v7A.MJyscwxiYCxO1Lc92EV6/HXcnxuovJboZbtkoWJGoPq', 'member');

INSERT INTO dbo.Books (title, author, availability) VALUES
  ('The Little Prince', 'Antoine de Saint-Exupéry', 'Y'),
  ('Atomic Habits', 'James Clear', 'Y'),
  ('Clean Code', 'Robert C. Martin', 'Y');

-- Example: one existing loan (marks the book as not available)
UPDATE dbo.Books SET availability = 'N' WHERE book_id = 3;
INSERT INTO dbo.Loans (user_id, book_id, loan_date, due_date, returned_date, status)
VALUES (2, 3, GETDATE(), DATEADD(day, 14, CAST(GETDATE() AS date)), NULL, 'BORROWED');

SELECT * FROM dbo.Users;
SELECT * FROM dbo.Books;
SELECT * FROM dbo.Loans;

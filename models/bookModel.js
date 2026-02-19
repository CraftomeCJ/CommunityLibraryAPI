const { poolPromise } = require("../dbConfig");

// Get all books
async function getAllBooks(options = {}) {
  const {
    page = 1,
    limit = 10,
    sort = "book_id",
    availability,
    title,
    author,
  } = options;
  const offset = (page - 1) * limit;
  const pool = await poolPromise;
  const request = pool.request();
  let query = "SELECT * FROM Books WHERE 1=1";

  if (availability) {
    query += " AND availability = @availability";
    request.input("availability", availability);
  }
  if (title) {
    query += " AND title LIKE @title";
    request.input("title", `%${title}%`);
  }
  if (author) {
    query += " AND author LIKE @author";
    request.input("author", `%${author}%`);
  }

  const safeSort = ["book_id", "title", "author", "availability"].includes(sort)
    ? sort
    : "book_id";
  query += ` ORDER BY ${safeSort} OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`;
  request.input("offset", offset).input("limit", Number(limit));

  const result = await request.query(query);
  return result.recordset;
}

// Get book by id
async function getBookById(bookId) {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("bookId", bookId)
      .query("SELECT * FROM Books WHERE book_id = @bookId");
    return result.recordset[0] || null;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
}

// Create a new book
async function createBook({ title, author, availability }) {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("title", title)
      .input("author", author)
      .input("availability", availability)
      .query(
        `INSERT INTO Books (title, author, availability)
                 OUTPUT INSERTED.book_id
                 VALUES (@title, @author, @availability)`,
      );
    return result.recordset[0].book_id;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
}

// Update book
async function updateBook(bookId, { title, author, availability }) {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("bookId", bookId)
      .input("title", title)
      .input("author", author)
      .input("availability", availability)
      .query(
        `UPDATE Books SET title = @title, author = @author, availability = @availability
                 WHERE book_id = @bookId`,
      );
    return result.rowsAffected[0] > 0;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
}

// Delete book
async function deleteBook(bookId) {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("bookId", bookId)
      .query("DELETE FROM Books WHERE book_id = @bookId");
    return result.rowsAffected[0] > 0;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
}

// Update book availability
async function updateBookAvailability(bookId, availability) {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("bookId", bookId)
      .input("availability", availability)
      .query(
        "UPDATE Books SET availability = @availability WHERE book_id = @bookId",
      );
    return result.rowsAffected[0] > 0;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
}

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  updateBookAvailability,
};

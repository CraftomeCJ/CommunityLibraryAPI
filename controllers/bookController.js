const bookModel = require("../models/bookModel");

// Get all books
async function getAllBooks(req, res) {
  try {
    const books = await bookModel.getAllBooks({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      sort: req.query.sort,
      availability: req.query.availability,
      title: req.query.title,
      author: req.query.author,
    });
    res.json(books);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get single book
async function getBookById(req, res) {
  const { bookId } = req.params;

  try {
    const book = await bookModel.getBookById(Number(bookId));
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Create book (librarian)
async function createBook(req, res) {
  const { title, author, availability } = req.body;

  try {
    const bookId = await bookModel.createBook({
      title,
      author,
      availability,
    });
    res.status(201).json({ message: "Book created", bookId });
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Update book (librarian)
async function updateBook(req, res) {
  const { bookId } = req.params;
  const { title, author, availability } = req.body;

  try {
    const updated = await bookModel.updateBook(Number(bookId), {
      title,
      author,
      availability,
    });
    if (!updated) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json({ message: "Book updated" });
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete book (librarian)
async function deleteBook(req, res) {
  const { bookId } = req.params;

  try {
    const deleted = await bookModel.deleteBook(Number(bookId));
    if (!deleted) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json({ message: "Book deleted" });
  } catch (error) {
    // Common case: book has existing loans (FK constraint)
    console.error("Controller error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Update book availability (librarian)
async function updateBookAvailability(req, res) {
  const { bookId } = req.params;
  const { availability } = req.body;

  try {
    const updated = await bookModel.updateBookAvailability(
      Number(bookId),
      availability,
    );
    if (!updated) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json({ message: "Book availability updated successfully" });
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ message: "Internal server error" });
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

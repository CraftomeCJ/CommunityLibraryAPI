const bookModel = require("../models/bookModel");

// Get all books
async function getAllBooks(req, res) {
  try {
    const books = await bookModel.getAllBooks();
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

  if (!title || !author) {
    return res.status(400).json({ message: "title and author are required" });
  }

  const avail = availability ?? "Y";
  if (avail !== "Y" && avail !== "N") {
    return res.status(400).json({ message: "availability must be Y or N" });
  }

  try {
    const bookId = await bookModel.createBook({ title, author, availability: avail });
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

  if (!title || !author || !availability) {
    return res
      .status(400)
      .json({ message: "title, author, and availability are required" });
  }

  if (availability !== "Y" && availability !== "N") {
    return res.status(400).json({ message: "availability must be Y or N" });
  }

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

  if (availability !== "Y" && availability !== "N") {
    return res.status(400).json({ message: "Availability must be Y or N" });
  }

  try {
    const updated = await bookModel.updateBookAvailability(Number(bookId), availability);
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

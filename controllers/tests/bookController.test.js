const request = require("supertest");
const express = require("express");
const bookController = require("../bookController");
const bookModel = require("../../models/bookModel");

// Mock dependencies
jest.mock("../../models/bookModel");
jest.mock("../../dbConfig", () => ({
  poolPromise: Promise.resolve({
    request: jest.fn(() => ({
      input: jest.fn().mockReturnThis(),
      query: jest.fn().mockResolvedValue({ recordset: [] }),
    })),
  }),
}));

const app = express();
app.use(express.json());
app.get("/books", bookController.getAllBooks);
app.get("/books/:id", bookController.getBookById);
app.post("/books", bookController.createBook);
app.put("/books/:id", bookController.updateBook);
app.delete("/books/:id", bookController.deleteBook);

describe("Book Controller", () => {
  describe("getAllBooks", () => {
    it("should return books list", async () => {
      bookModel.getAllBooks.mockResolvedValue([
        { book_id: 1, title: "Book1", author: "Author1" },
      ]);

      const res = await request(app).get("/books");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([
        { book_id: 1, title: "Book1", author: "Author1" },
      ]);
    });
  });

  describe("getBookById", () => {
    it("should return a book", async () => {
      bookModel.getBookById.mockResolvedValue({
        book_id: 1,
        title: "Book1",
      });

      const res = await request(app).get("/books/1");

      expect(res.status).toBe(200);
      expect(res.body.title).toBe("Book1");
    });

    it("should return 404 for non-existent book", async () => {
      bookModel.getBookById.mockResolvedValue(null);

      const res = await request(app).get("/books/999");

      expect(res.status).toBe(404);
    });
  });

  describe("createBook", () => {
    it("should create a book", async () => {
      bookModel.createBook.mockResolvedValue(1);

      const res = await request(app)
        .post("/books")
        .send({ title: "New Book", author: "Author", availability: "Y" });

      expect(res.status).toBe(201);
      expect(res.body.bookId).toBe(1);
    });
  });

  describe("updateBook", () => {
    it("should update a book", async () => {
      bookModel.updateBook.mockResolvedValue({ rowsAffected: [1] });

      const res = await request(app)
        .put("/books/1")
        .send({ title: "Updated Book", author: "Someone", availability: "Y" });

      expect(res.status).toBe(200);
    });
  });

  describe("deleteBook", () => {
    it("should delete a book", async () => {
      bookModel.deleteBook.mockResolvedValue({ rowsAffected: [1] });

      const res = await request(app).delete("/books/1");

      expect(res.status).toBe(200);
    });
  });
});

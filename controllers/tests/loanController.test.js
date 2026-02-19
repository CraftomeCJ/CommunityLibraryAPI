const request = require("supertest");
const express = require("express");
const loanController = require("../loanController");
const loanModel = require("../../models/loanModel");

// Mock dependencies
jest.mock("../../models/loanModel");
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

// helper to set req.user
const asUser = (user) => (req, _res, next) => {
  req.user = user;
  next();
};

// member routes
app.post(
  "/loans",
  asUser({ id: 1, role: "member" }),
  loanController.createLoan,
);
app.get("/loans", asUser({ id: 1, role: "member" }), loanController.getLoans);
// librarian route
app.put(
  "/loans/:loanId/return",
  asUser({ id: 99, role: "librarian" }),
  loanController.returnLoan,
);

describe("Loan Controller", () => {
  describe("borrowBook", () => {
    it("should borrow a book", async () => {
      loanModel.createLoan.mockResolvedValue({ ok: true, loanId: 1 });

      const res = await request(app)
        .post("/loans")
        .send({ bookId: 1, dueDate: "2026-03-01" });

      expect(res.status).toBe(201);
      expect(res.body.loanId).toBe(1);
    });
  });

  describe("getLoans", () => {
    it("should return loans", async () => {
      loanModel.getLoansForUser.mockResolvedValue([
        { loan_id: 1, book_title: "Book1" },
      ]);

      const res = await request(app).get("/loans");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ loan_id: 1, book_title: "Book1" }]);
    });
  });

  describe("returnLoan", () => {
    it("should return a loan", async () => {
      loanModel.returnLoan.mockResolvedValue({ ok: true });

      const res = await request(app).put("/loans/1/return");

      expect(res.status).toBe(200);
    });
  });
});

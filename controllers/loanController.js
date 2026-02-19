const loanModel = require("../models/loanModel");

// Create a new loan
async function createLoan(req, res) {
  const { bookId, userId, dueDate } = req.body;

  if (!bookId || !dueDate) {
    return res.status(400).json({ message: "bookId and dueDate are required" });
  }

  // Members can only create loans for themselves
  const effectiveUserId =
    req.user.role === "librarian" && userId ? userId : req.user.id;
  if (req.user.role !== "librarian" && userId && userId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const result = await loanModel.createLoan({
      userId: effectiveUserId,
      bookId: Number(bookId),
      dueDate,
    });

    if (!result.ok) {
      if (result.reason === "BOOK_NOT_FOUND") {
        return res.status(404).json({ message: "Book not found" });
      }
      if (result.reason === "BOOK_NOT_AVAILABLE") {
        return res.status(400).json({ message: "Book is not available" });
      }
      return res.status(400).json({ message: "Unable to create loan" });
    }

    res.status(201).json({ message: "Loan created", loanId: result.loanId });
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get loans (member: own loans, librarian: all loans)
async function getLoans(req, res) {
  try {
    if (req.user.role === "librarian") {
      const loans = await loanModel.getAllLoans({
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        sort: req.query.sort,
        status: req.query.status,
      });
      return res.json(loans);
    }

    const loans = await loanModel.getLoansForUser(req.user.id);
    res.json(loans);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getLoanById(req, res) {
  try {
    const loan = await loanModel.getLoanById(Number(req.params.loanId));
    if (!loan) return res.status(404).json({ message: "Loan not found" });
    if (req.user.role !== "librarian" && loan.user_id !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    res.json(loan);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function deleteLoan(req, res) {
  try {
    const ok = await loanModel.deleteLoan(Number(req.params.loanId));
    if (!ok) return res.status(404).json({ message: "Loan not found" });
    res.json({ message: "Loan deleted" });
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Return a loan (librarian only)
async function returnLoan(req, res) {
  const { loanId } = req.params;
  try {
    const result = await loanModel.returnLoan(Number(loanId));

    if (!result.ok) {
      if (result.reason === "LOAN_NOT_FOUND") {
        return res.status(404).json({ message: "Loan not found" });
      }
      if (result.reason === "ALREADY_RETURNED") {
        return res.status(400).json({ message: "Loan already returned" });
      }
      return res.status(400).json({ message: "Unable to return loan" });
    }

    res.json({ message: "Loan returned" });
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createLoan,
  getLoans,
  getLoanById,
  deleteLoan,
  returnLoan,
};

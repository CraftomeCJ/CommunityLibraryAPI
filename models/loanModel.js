const { sql, poolPromise } = require("../dbConfig");

/**
 * Create a loan transaction:
 * - Validate book availability = 'Y'
 * - Mark book availability to 'N'
 * - Insert into Loans
 */
async function createLoan({ userId, bookId, dueDate }) {
  const pool = await poolPromise;
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    // Lock the book row to prevent double-loan
    const bookResult = await new sql.Request(transaction)
      .input("bookId", sql.Int, bookId)
      .query(
        "SELECT book_id, availability FROM Books WITH (UPDLOCK, ROWLOCK) WHERE book_id = @bookId"
      );

    const book = bookResult.recordset[0];
    if (!book) {
      await transaction.rollback();
      return { ok: false, reason: "BOOK_NOT_FOUND" };
    }

    if (book.availability !== "Y") {
      await transaction.rollback();
      return { ok: false, reason: "BOOK_NOT_AVAILABLE" };
    }

    // Set book unavailable
    await new sql.Request(transaction)
      .input("bookId", sql.Int, bookId)
      .query("UPDATE Books SET availability = 'N' WHERE book_id = @bookId");

    // Insert loan
    const insertResult = await new sql.Request(transaction)
      .input("userId", sql.Int, userId)
      .input("bookId", sql.Int, bookId)
      .input("dueDate", sql.Date, dueDate)
      .query(
        "INSERT INTO Loans (user_id, book_id, loan_date, due_date, status) " +
          "OUTPUT INSERTED.loan_id VALUES (@userId, @bookId, GETDATE(), @dueDate, 'BORROWED')"
      );

    await transaction.commit();
    return { ok: true, loanId: insertResult.recordset[0].loan_id };
  } catch (error) {
    try {
      await transaction.rollback();
    } catch (_) {
      // ignore rollback errors
    }
    console.error("Database error:", error);
    throw error;
  }
}

async function getLoansForUser(userId) {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("userId", sql.Int, userId)
      .query(
        "SELECT l.*, b.title, b.author FROM Loans l " +
          "JOIN Books b ON b.book_id = l.book_id " +
          "WHERE l.user_id = @userId ORDER BY l.loan_date DESC"
      );
    return result.recordset;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
}

async function getAllLoans() {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(
      "SELECT l.*, b.title, b.author, u.username FROM Loans l " +
        "JOIN Books b ON b.book_id = l.book_id " +
        "JOIN Users u ON u.user_id = l.user_id " +
        "ORDER BY l.loan_date DESC"
    );
    return result.recordset;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
}

/**
 * Mark loan returned:
 * - set returned_date, status
 * - set book availability back to 'Y'
 */
async function returnLoan(loanId) {
  const pool = await poolPromise;
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    const loanResult = await new sql.Request(transaction)
      .input("loanId", sql.Int, loanId)
      .query(
        "SELECT loan_id, book_id, status FROM Loans WITH (UPDLOCK, ROWLOCK) WHERE loan_id = @loanId"
      );

    const loan = loanResult.recordset[0];
    if (!loan) {
      await transaction.rollback();
      return { ok: false, reason: "LOAN_NOT_FOUND" };
    }

    if (loan.status === "RETURNED") {
      await transaction.rollback();
      return { ok: false, reason: "ALREADY_RETURNED" };
    }

    await new sql.Request(transaction)
      .input("loanId", sql.Int, loanId)
      .query(
        "UPDATE Loans SET returned_date = GETDATE(), status = 'RETURNED' WHERE loan_id = @loanId"
      );

    await new sql.Request(transaction)
      .input("bookId", sql.Int, loan.book_id)
      .query("UPDATE Books SET availability = 'Y' WHERE book_id = @bookId");

    await transaction.commit();
    return { ok: true };
  } catch (error) {
    try {
      await transaction.rollback();
    } catch (_) {
      // ignore
    }
    console.error("Database error:", error);
    throw error;
  }
}

module.exports = {
  createLoan,
  getLoansForUser,
  getAllLoans,
  returnLoan,
};

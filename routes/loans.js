const express = require("express");
const { verifyJWT, authorize } = require("../middlewares/auth");
const loanController = require("../controllers/loanController");

const router = express.Router();

// Create loan - member & librarian
router.post(
  "/",
  verifyJWT,
  authorize(["member", "librarian"]),
  loanController.createLoan,
);

// List loans - member sees own, librarian sees all
router.get(
  "/",
  verifyJWT,
  authorize(["member", "librarian"]),
  loanController.getLoans,
);

router.get(
  "/:loanId",
  verifyJWT,
  authorize(["member", "librarian"]),
  loanController.getLoanById,
);

// Return a loan - librarian only
router.put(
  "/:loanId/return",
  verifyJWT,
  authorize(["librarian"]),
  loanController.returnLoan,
);

router.delete(
  "/:loanId",
  verifyJWT,
  authorize(["librarian"]),
  loanController.deleteLoan,
);

module.exports = router;

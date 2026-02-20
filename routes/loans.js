const express = require("express");
const { verifyJWT, authorize } = require("../middlewares/auth");
const loanController = require("../controllers/loanController");
const { validate, validateParams } = require("../middlewares/validation");
const { createLoanSchema, loanIdParamSchema } = require("../validators/loanValidators");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Loans
 *   description: Loan management endpoints
 */

/**
 * @swagger
 * /loans:
 *   post:
 *     summary: "Create a loan (member self; librarian can specify userId)"
 *     tags: [Loans]
 *     security: [ { bearerAuth: [] } ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [bookId, dueDate]
 *             properties:
 *               bookId: { type: integer }
 *               dueDate: { type: string, format: date }
 *               userId: { type: integer, description: "Librarian only: create for user" }
 *     responses:
 *       201: { description: Created }
 *       400: { description: Validation error }
 *       403: { description: Forbidden }
 *   get:
 *     summary: "List loans (member: own; librarian: all)"
 *     tags: [Loans]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [ON_LOAN, RETURNED] }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [loan_id, loan_date, due_date, status] }
 *     responses:
 *       200: { description: OK }
 */
router.post(
  "/",
  verifyJWT,
  authorize(["member", "librarian"]),
  validate(createLoanSchema),
  loanController.createLoan,
);
router.get(
  "/",
  verifyJWT,
  authorize(["member", "librarian"]),
  loanController.getLoans,
);

/**
 * @swagger
 * /loans/{loanId}:
 *   get:
 *     summary: "Get loan by id (member if own; librarian any)"
 *     tags: [Loans]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: loanId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *       403: { description: Forbidden }
 *       404: { description: Not found }
 *   delete:
 *     summary: "Delete a loan (librarian)"
 *     tags: [Loans]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: loanId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Deleted }
 *       404: { description: Not found }
 */
router.get(
  "/:loanId",
  verifyJWT,
  authorize(["member", "librarian"]),
  validateParams(loanIdParamSchema),
  loanController.getLoanById,
);

router.delete(
  "/:loanId",
  verifyJWT,
  authorize(["librarian"]),
  validateParams(loanIdParamSchema),
  loanController.deleteLoan,
);

/**
 * @swagger
 * /loans/{loanId}/return:
 *   put:
 *     summary: "Return a loan (librarian) and set book availability"
 *     tags: [Loans]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: loanId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Returned }
 *       404: { description: Not found }
 */
router.put(
  "/:loanId/return",
  verifyJWT,
  authorize(["librarian"]),
  validateParams(loanIdParamSchema),
  loanController.returnLoan,
);

module.exports = router;

const express = require("express");
const { verifyJWT, authorize } = require("../middlewares/auth");
const { validate, validateParams } = require("../middlewares/validation");
const {
  createBookSchema,
  updateBookSchema,
  updateAvailabilitySchema,
  bookIdParamSchema
} = require("../validators/bookValidators");
const bookController = require("../controllers/bookController");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book management endpoints
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: "List books with filters/pagination"
 *     tags: [Books]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema: { type: string }
 *       - in: query
 *         name: author
 *         schema: { type: string }
 *       - in: query
 *         name: availability
 *         schema: { type: string, enum: [Y, N] }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [book_id, title, author, availability] }
 *     responses:
 *       200: { description: OK }
 *   post:
 *     summary: "Create a book (librarian)"
 *     tags: [Books]
 *     security: [ { bearerAuth: [] } ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, author, availability]
 *             properties:
 *               title: { type: string }
 *               author: { type: string }
 *               availability: { type: string, enum: [Y, N] }
 *     responses:
 *       201: { description: Created }
 */
router.get(
  "/",
  verifyJWT,
  authorize(["member", "librarian"]),
  bookController.getAllBooks,
);
router.post(
  "/",
  verifyJWT,
  authorize(["librarian"]),
  validate(createBookSchema),
  bookController.createBook,
);

/**
 * @swagger
 * /books/{bookId}:
 *   get:
 *     summary: "Get book by id"
 *     tags: [Books]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not found }
 *   put:
 *     summary: "Update a book (librarian)"
 *     tags: [Books]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               author: { type: string }
 *               availability: { type: string, enum: [Y, N] }
 *     responses:
 *       200: { description: Updated }
 *       404: { description: Not found }
 *   delete:
 *     summary: "Delete a book (librarian)"
 *     tags: [Books]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Deleted }
 *       404: { description: Not found }
 */
router.get(
  "/:bookId",
  verifyJWT,
  authorize(["member", "librarian"]),
  validateParams(bookIdParamSchema),
  bookController.getBookById,
);
router.put(
  "/:bookId",
  verifyJWT,
  authorize(["librarian"]),
  validateParams(bookIdParamSchema),
  validate(updateBookSchema),
  bookController.updateBook,
);
router.delete(
  "/:bookId",
  verifyJWT,
  authorize(["librarian"]),
  validateParams(bookIdParamSchema),
  bookController.deleteBook,
);

/**
 * @swagger
 * /books/{bookId}/availability:
 *   put:
 *     summary: "Update book availability (librarian)"
 *     tags: [Books]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [availability]
 *             properties:
 *               availability: { type: string, enum: [Y, N] }
 *     responses:
 *       200: { description: Updated }
 *       404: { description: Not found }
 */
router.put(
  "/:bookId/availability",
  verifyJWT,
  authorize(["librarian"]),
  validateParams(bookIdParamSchema),
  validate(updateAvailabilitySchema),
  bookController.updateBookAvailability,
);

module.exports = router;

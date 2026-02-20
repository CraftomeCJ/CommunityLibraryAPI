const express = require("express");
const { searchOpenLibrary } = require("../controllers/externalController");
const { verifyJWT } = require("../middlewares/auth");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: External
 *   description: Open Library proxy endpoints
 */

/**
 * @swagger
 * /external/books:
 *   get:
 *     summary: "Search Open Library (proxy)"
 *     tags: [External]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema: { type: string }
 *       - in: query
 *         name: author
 *         schema: { type: string }
 *       - in: query
 *         name: isbn
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 *       400: { description: Missing query }
 */
router.get("/books", verifyJWT, searchOpenLibrary);

module.exports = router;

const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();
const { getAllUsersController } = require("../controllers/authController");
const { verifyJWT, authorize } = require("../middlewares/auth");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication & user management
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: "Register a new user"
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password, role]
 *             properties:
 *               username: { type: string }
 *               password: { type: string }
 *               role: { type: string, enum: [member, librarian] }
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Invalid input
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: "Login and receive JWT"
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /auth/users:
 *   get:
 *     summary: "List all users (librarian)"
 *     tags: [Auth]
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       200: { description: OK }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 */
router.get(
  "/users",
  verifyJWT,
  authorize(["librarian"]),
  getAllUsersController,
);

/**
 * @swagger
 * /auth/users/{userId}:
 *   get:
 *     summary: "Get user by id (librarian)"
 *     tags: [Auth]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not found }
 *   put:
 *     summary: "Update user role (librarian)"
 *     tags: [Auth]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role: { type: string, enum: [member, librarian] }
 *     responses:
 *       200: { description: Updated }
 *       404: { description: Not found }
 *   delete:
 *     summary: "Delete user (librarian)"
 *     tags: [Auth]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Deleted }
 *       404: { description: Not found }
 */
router.get(
  "/users/:userId",
  verifyJWT,
  authorize(["librarian"]),
  authController.getUserByIdController,
);
router.put(
  "/users/:userId/role",
  verifyJWT,
  authorize(["librarian"]),
  authController.updateUserRoleController,
);
router.delete(
  "/users/:userId",
  verifyJWT,
  authorize(["librarian"]),
  authController.deleteUserController,
);

module.exports = router;

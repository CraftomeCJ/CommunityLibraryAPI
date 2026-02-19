const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();
const { getAllUsersController } = require("../controllers/authController");
const { verifyJWT, authorize } = require("../middlewares/auth");

// Register endpoint
router.post("/register", authController.register);

// Login endpoint
router.post("/login", authController.login);

// Get all users (librarian only)
router.get(
  "/users",
  verifyJWT,
  authorize(["librarian"]),
  getAllUsersController,
);

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

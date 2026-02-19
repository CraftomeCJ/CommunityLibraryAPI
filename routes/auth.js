const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();
const { getAllUsersController } = require("../controllers/authController");
const { verifyJWT } = require("../middlewares/auth");

// Register endpoint
router.post("/register", authController.register);

// Login endpoint
router.post("/login", authController.login);

// Get all users (librarian only)
router.get("/users", verifyJWT, getAllUsersController);

module.exports = router;

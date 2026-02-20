const express = require("express");
const { searchOpenLibrary } = require("../controllers/externalController");
const { verifyJWT } = require("../middlewares/auth");
const router = express.Router();

router.get("/books", verifyJWT, searchOpenLibrary);

module.exports = router;

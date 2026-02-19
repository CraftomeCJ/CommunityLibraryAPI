require("dotenv").config();
const express = require("express");

const app = express();

// Middleware
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/books");
const loanRoutes = require("./routes/loans");

app.use("/auth", authRoutes);
app.use("/books", bookRoutes);
app.use("/loans", loanRoutes);

// Basic health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

module.exports = app;

require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const winston = require("winston");
const externalRoutes = require("./routes/external");

const app = express();
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

// Middleware
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  }),
);
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/books");
const loanRoutes = require("./routes/loans");

app.use("/auth", authRoutes);
app.use("/books", bookRoutes);
app.use("/loans", loanRoutes);
app.use("/external", externalRoutes);

// Basic health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// global error handler
app.use((err, req, res, _next) => {
  logger.error(err.message);
  res.status(500).json({ error: "Something went wrong" });
});

module.exports = app;

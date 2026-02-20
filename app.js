require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const winston = require("winston");
const { format } = winston;
const externalRoutes = require("./routes/external");

const app = express();
const logger = winston.createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(), // add timestamp
    format.json(),
  ),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

// Audit trail: log user, role, method, path
app.use((req, _res, next) => {
  logger.info({
    msg: "request",
    method: req.method,
    path: req.originalUrl,
    userId: req.user?.id || null,
    role: req.user?.role || null,
  });
  next();
});

// Middleware
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info({ msg: message.trim() }) },
  }),
);
app.use(express.json());
app.use(express.static("public"));

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
  logger.error({ msg: err.message });
  res.status(500).json({ error: "Something went wrong" });
});

module.exports = app;

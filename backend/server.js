require("dotenv").config();

const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const PORT = process.env.PORT || 8080;
const app = express();

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000" }));
app.use(helmet());

// Rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login requests per windowMs
  message: "Too many login attempts, please try again after 15 minutes",
});
app.use("/api/v1/auth/login", loginLimiter);

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);
app.use(express.static(path.join(__dirname, "public")));

// Import routes
const authRoutes = require("./routes/auth");
const userApiRoutes = require("./routes/users");
const budgetApiRoutes = require("./routes/budget");
const contactsApiRoutes = require("./routes/contacts");
const transfersApiRoutes = require("./routes/transfers");
const transactionsApiRoutes = require("./routes/transactions");
const historyRoutes = require("./routes/history");

// Mount routes

// Auth routes (login, register, etc.)
app.use("/api/v1/auth", authRoutes);

// User routes
app.use("/api/v1/users", userApiRoutes);

// Admin routes
app.use("/api/v1/admin/users", userApiRoutes);

// History routes
app.use("/api/v1/history", historyRoutes); // For testing without auth

// app.use("/api/v1/contacts", authMiddleware, contactsApiRoutes);
app.use('/api/v1/contacts', contactsApiRoutes) // For testing without auth

// Budget, contacts, transfers, and transactions routes
<<<<<<< HEAD
app.use("/api/v1/budget", authMiddleware, budgetApiRoutes);
app.use("/api/v1/transfers", authMiddleware, transfersApiRoutes);
app.use("/api/v1/transactions", authMiddleware, transactionsApiRoutes);
=======
app.use("/api/v1/budget", budgetApiRoutes);
app.use("/api/v1/contacts", contactsApiRoutes);
app.use("/api/v1/transfers", transfersApiRoutes);
app.use("/api/v1/transactions", transactionsApiRoutes);
>>>>>>> feature/history-page

// Serve the React app
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// Export the app (without calling app.listen)
module.exports = app;

// Only start the server if this file is run directly (not during tests)
if (require.main === module) {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

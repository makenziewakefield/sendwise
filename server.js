// Load .env data into process.env
require("dotenv").config();

// Web server config
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const morgan = require("morgan");
const path = require("path");

const PORT = process.env.PORT || 8080;
const app = express();

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);
app.use(express.static(path.join(__dirname, "public")));

// Import the routes
const userApiRoutes = require("./routes/users-api");
const budgetApiRoutes = require("./routes/budget-api");
const contactsApiRoutes = require("./routes/contacts-api");
const transfersApiRoutes = require("./routes/transfers-api");
const transactionsApiRoutes = require("./routes/transactions-api");

// Mount all resource routes
app.use("/api/users", userApiRoutes);
app.use("/api/budget", budgetApiRoutes);
app.use("/api/contacts", contactsApiRoutes);
app.use("/api/transfers", transfersApiRoutes);
app.use("/api/transactions", transactionsApiRoutes);

// Serve the React app
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

const express = require("express");
const router = express.Router();

// Get all users
router.get("/", (req, res) => {});

// Get a specific user by ID
router.get("/:id", (req, res) => {});

// Add a new user
router.post("/", (req, res) => {});

// Update a user by ID
router.put("/:id", (req, res) => {});

// Delete a user by ID
router.delete("/:id", (req, res) => {});

module.exports = router;

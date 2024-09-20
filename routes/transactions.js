const express = require("express");
const router = express.Router();

// Get all transactions for a user
router.get("/:userId", (req, res) => {});

// Create a new transaction
router.post("/", (req, res) => {});

// Get a specific transaction by ID
router.get("/:id", (req, res) => {});

// Update a transaction by ID
router.put("/:id", (req, res) => {});

// Delete a transaction by ID
router.delete("/:id", (req, res) => {});

module.exports = router;

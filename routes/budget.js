const express = require("express");
const router = express.Router();

// Get all budgets
router.get("/", (req, res) => {});

// Get budget by user ID
router.get("/:userId", (req, res) => {});

// Create a new budget
router.post("/", (req, res) => {});

// Update a budget by ID
router.put("/:id", (req, res) => {});

// Delete a budget by ID
router.delete("/:id", (req, res) => {});

module.exports = router;

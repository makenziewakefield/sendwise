const express = require("express");
const router = express.Router();

// Get all transfers for a user
router.get("/:userId", (req, res) => {});

// Create a new transfer
router.post("/", (req, res) => {});

// Get a specific transfer by ID
router.get("/:id", (req, res) => {});

// Update a transfer by ID
router.put("/:id", (req, res) => {});

// Delete a transfer by ID
router.delete("/:id", (req, res) => {});

module.exports = router;

const express = require("express");
const router = express.Router();

// Get all contacts for a user
router.get("/:userId", (req, res) => {});

// Add a new contact
router.post("/", (req, res) => {});

// Delete a contact by ID
router.delete("/:id", (req, res) => {});

module.exports = router;

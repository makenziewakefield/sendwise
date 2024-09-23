const express = require("express");
const router = express.Router();

// Admin route: Get all contacts
router.get("/", (req, res) => {
  // Implementation
});

// User route: Get contacts for a specific user
router.get("/:userId", (req, res) => {
  // Implementation
});

// Add a new contact
router.post("/", (req, res) => {
  // Implementation
});

// Delete a contact by ID
router.delete("/:id", (req, res) => {
  // Implementation
});

module.exports = router;

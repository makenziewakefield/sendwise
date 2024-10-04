const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const pool = require("../db/connection");

// Admin route: Get all users
router.get("/", (req, res) => {
  // Implementation
});

// User route: Get a specific user's data by ID
router.get("/:userId", (req, res) => {
  // Implementation
});

// Add a new user
router.post(
  "/",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
    // Add more validation as needed
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Implementation
  }
);

// Update a user by ID
router.put("/:userId", (req, res) => {
  // Implementation
});

// Delete a user by ID
router.delete("/:userId", (req, res) => {
  // Implementation
});

router.get('/:userId/wallet-balance', async (req, res) => {
  const { userId } = req.params;
  console.log(`Fetching wallet balance for user ${userId}`); // Add a log

  try {
    const result = await pool.query('SELECT wallet_balance FROM users WHERE user_id = $1', [userId]);
    
    if (result.rows.length === 0) {
      console.log(`User ${userId} not found`);
      return res.status(404).json({ message: 'User not found' });
    }

    const balance = result.rows[0].wallet_balance;
    console.log(`Wallet balance for user ${userId}: $${balance}`); // Add a log
    res.json({ balance });
  } catch (err) {
    console.error('Error fetching wallet balance:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

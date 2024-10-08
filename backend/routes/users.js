const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const pool = require("../db/connection");
const {
  getUsers,
  getUserById,
  addUser,
  updateUserById,
  getBalance,
  deleteUserById,
} = require("../db/queries/users");

// Admin route: Get all users
router.get("/", (req, res) => {
  getUsers()
    .then((users) => res.json(users))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Error fetching users" });
    });
});

// User route: Get a specific user's data by ID
router.get("/:userId", (req, res) => {
  const { userId } = req.params;
  getUserById(userId)
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Error fetching user" });
    });
});

// Add a new user
router.post(
  "/",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 characters long"),
    body("wallet_balance")
      .optional()
      .isDecimal()
      .withMessage("Wallet balance must be a decimal number"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, wallet_balance = 0.0 } = req.body;

    addUser({ username, email, password, wallet_balance })
      .then((user) => res.status(201).json(user))
      .catch((err) => {
        console.error(err);
        res.status(500).json({ message: "Error adding user" });
      });
  }
);

// Update a user by ID
router.put("/:userId", (req, res) => {
  const { userId } = req.params;
  const { username, email, wallet_balance } = req.body;

  updateUserById(userId, { username, email, wallet_balance })
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Error updating user" });
    });
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

// Delete a user by ID
router.delete("/:userId", (req, res) => {
  const { userId } = req.params;

  deleteUserById(userId)
    .then((user) => {
      if (user) {
        res.json({ message: "User deleted", user });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Error deleting user" });
    });
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

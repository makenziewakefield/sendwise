const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const {
  getUsers,
  getUserById,
  addUser,
  updateUserById,
  getUserBalance,
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

// Get user balance
router.get("/:userId/balance", async (req, res) => {
  try {
    const balance = await getUserBalance(req.params.userId);
    res.status(200).json({ balance });
  } catch (error) {
    console.error("Error fetching user balance:", error);
    res.status(500).json({ error: "Internal server error" });
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

module.exports = router;

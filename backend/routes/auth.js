const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const db = require("../db/connection");

const router = express.Router();

// Registration
router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, username, email, password } = req.body;

    // Check if user exists
    const userExists = await db.query(
      "SELECT * FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );
    if (userExists.rows.length > 0) {
      return res
        .status(400)
        .json({ msg: "User with this email or username already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await db.query(
      "INSERT INTO users (first_name, last_name, username, email, password, wallet_balance) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [first_name, last_name, username, email, hashedPassword, 0]
    );

    // Create JWT Token
    const payload = { user: { id: newUser.rows[0].user_id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ token });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// User login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(400).json({ msg: "User not found" });
    }

    console.log("Stored password:", user.rows[0].password);
    console.log("Entered password:", password);

    // Check if the stored password is a valid bcrypt hash
    if (
      !user.rows[0].password.startsWith("$2a$") &&
      !user.rows[0].password.startsWith("$2b$")
    ) {
      console.error("Stored password is not a valid bcrypt hash");
      return res
        .status(500)
        .json({ msg: "Invalid password format in database" });
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Create JWT Token
    const payload = { user: { id: user.rows[0].id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const db = require("../db/connection");

const router = express.Router();

// Registration
router.post(
  "/register",
  [
    body("first_name").notEmpty(),
    body("last_name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { first_name, last_name, email, password } = req.body;

    try {
      // Check if user exists
      const userExists = await db.query("SELECT * FROM users WHERE email = $1", [email]);
      if (userExists.rows.length > 0) {
        return res.status(400).json({ msg: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user with 0 wallet_balance
      const newUser = await db.query(
        "INSERT INTO users (first_name, last_name, email, password, wallet_balance) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [first_name, last_name, email, hashedPassword, 0]
      );

      // Create JWT Token
      const payload = { user: { id: newUser.rows[0].id } };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.json({ token });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

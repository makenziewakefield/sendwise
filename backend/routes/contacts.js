const express = require("express");
const router = express.Router();
const pool = require("../db/connection");


// User route: Get contacts for a specific user
router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const result = await pool.query("SELECT * FROM contacts WHERE user_id = $1", [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No contacts found for this user" });
    }
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching user's contacts", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Add a new contact
router.post("/", async (req, res) => {
  const { user_id, contact_name, contact_email, contact_phone, contact_nickname } = req.body;
  if (!user_id || !contact_name) {
    return res.status(400).json({ error: "user_id and contact_name are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO contacts (user_id, contact_name, contact_email, contact_phone, contact_nickname) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [user_id, contact_name, contact_email, contact_phone, contact_nickname]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding contact", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Update a contact by ID
router.put("/:id", async (req, res) => {
  const contactId = req.params.id;
  const { contact_name, contact_email, contact_phone, contact_nickname } = req.body;

  if (!contact_name || !contact_email || !contact_phone) {
    return res.status(400).json({ error: "Name, email, and phone are required" });
  }

  try {
    const result = await pool.query(
      "UPDATE contacts SET contact_name = $1, contact_email = $2, contact_phone = $3, contact_nickname = $4 WHERE id = $5 RETURNING *",
      [contact_name, contact_email, contact_phone, contact_nickname, contactId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Contact not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating contact", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Delete a contact by ID
router.delete("/:id", async (req, res) => {
  const contactId = req.params.id;
  try {
    const result = await pool.query("DELETE FROM contacts WHERE id = $1 RETURNING *", [contactId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.json({ message: "Contact deleted", contact: result.rows[0] });
  } catch (err) {
    console.error("Error deleting contact", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

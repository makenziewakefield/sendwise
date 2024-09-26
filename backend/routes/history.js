const express = require("express");
const router = express.Router();
const db = require("../db/connection");

router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT t.date, t.description, t.category, t.amount_in, t.amount_out,
              (SELECT SUM(amount_in) - SUM(amount_out)
                FROM transactions
                WHERE user_id = t.user_id AND date <= t.date) AS balance
      FROM transactions t
      WHERE t.user_id = $1
      ORDER BY t.date DESC
      LIMIT 15
    `;
    const result = await db.query(query, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching transaction history" });
  }
});

module.exports = router;
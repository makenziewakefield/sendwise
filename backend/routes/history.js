const express = require("express");
const router = express.Router();
const { getTransactionsByUserId } = require("../db/queries/transactions");
const { getTransfersByUserId } = require("../db/queries/transfers");

// Route to get both transactions and transfers for a specific user
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch transactions and transfers for the user
    const transactions = await getTransactionsByUserId(userId);
    const transfers = await getTransfersByUserId(userId);

    // Combine both into a single response
    const history = {
      transactions,
      transfers,
    };

    return res.json(history); // Send the combined data as a response
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

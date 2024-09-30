const express = require("express");
const router = express.Router();
const {
  createTransaction,
  getTransactionsByUserId,
  deleteTransactionById,
  updateTransaction,
} = require("../queries/transactions");
const authMiddleware = require("../middleware/auth"); // Ensure you have the correct path to your middleware

// User route: Get all transactions for a specific user
router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const transactions = await getTransactionsByUserId(req.params.userId);
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new transaction
router.post("/", authMiddleware, async (req, res) => {
  const { userId, amount, category, description } = req.body;
  try {
    const newTransaction = await createTransaction(
      userId,
      amount,
      category,
      description
    );
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a transaction by ID
router.put("/:id", authMiddleware, async (req, res) => {
  const transactionId = req.params.id;
  const updatedData = req.body;
  try {
    const updatedTransaction = await updateTransaction(
      transactionId,
      updatedData
    );
    res.status(200).json(updatedTransaction);
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a transaction by ID
router.delete("/:id", authMiddleware, async (req, res) => {
  const transactionId = req.params.id;
  try {
    const deletedTransaction = await deleteTransactionById(transactionId);
    res.status(200).json(deletedTransaction);
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

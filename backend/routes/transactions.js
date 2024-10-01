// routes/transactions.js
const express = require("express");
const router = express.Router();
const {
  getAllTransactions,
  getTransactionsByUserId,
  getTransactionById,
  createTransaction,
  deleteTransactionById,
} = require("../db/queries/transactions");

// Get all transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await getAllTransactions();
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching all transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// User route: Get all transactions for a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const transactions = await getTransactionsByUserId(req.params.userId);
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get a transaction by ID
router.get("/:id", async (req, res) => {
  try {
    const transaction = await getTransactionById(req.params.id);
    if (transaction) {
      res.status(200).json(transaction);
    } else {
      res.status(404).json({ error: "Transaction not found" });
    }
  } catch (error) {
    console.error("Error fetching transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new transaction
router.post("/", async (req, res) => {
  const { userId, amount, category, description, isIncoming } = req.body;
  try {
    const newTransaction = await createTransaction(
      userId,
      amount,
      category,
      description,
      isIncoming
    );
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a transaction by ID
router.delete("/:id", async (req, res) => {
  const transactionId = req.params.id;
  try {
    const deletedTransaction = await deleteTransactionById(transactionId);
    if (deletedTransaction) {
      res.status(200).json({ message: "Transaction deleted successfully" });
    } else {
      res.status(404).json({ error: "Transaction not found" });
    }
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

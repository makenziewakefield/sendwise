const express = require("express");
const router = express.Router();
const db = require("../db/connection"); // Import the db instance
const {
  getAllTransfers,
  getTransfersByUserId,
  createTransfer,
  getTransferHistory,
  updateUserBalance,
  createTransferTransaction,
  deleteTransferById,
} = require("../db/queries/transfers");

// Admin route: Get all transfer histories (for admins)
router.get("/history", async (req, res) => {
  try {
    const allTransfers = await getAllTransfers(); // Fetch all transfers
    res.status(200).json(allTransfers);
  } catch (error) {
    console.error("Error fetching all transfer history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// User route: Get all transfers for a specific user
router.get("/:userId", async (req, res) => {
  try {
    const transfers = await getTransfersByUserId(req.params.userId);
    res.status(200).json(transfers);
  } catch (error) {
    console.error("Error fetching transfers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new transfer
router.post("/", async (req, res) => {
  const { senderId, recipientId, amount, method, description } = req.body;

  try {
    console.log("Received transfer request:", {
      senderId,
      recipientId,
      amount,
      method,
      description,
    });

    // Step 1: Get the sender's current wallet balance
    const { rows: senderRows } = await db.query(
      "SELECT wallet_balance FROM users WHERE user_id = $1",
      [senderId]
    );

    console.log("Sender balance query result:", senderRows);

    // If sender is not found, return an error
    if (senderRows.length === 0) {
      return res.status(404).json({ error: "Sender not found" });
    }

    const senderBalance = senderRows[0].wallet_balance;

    // Step 2: Check if recipient exists
    const { rows: recipientRows } = await db.query(
      "SELECT user_id FROM users WHERE user_id = $1",
      [recipientId]
    );

    if (recipientRows.length === 0) {
      return res.status(404).json({ error: "Recipient not found" });
    }

    // Step 3: Check if amount exceeds the sender's balance
    if (amount > senderBalance) {
      return res.status(400).json({ error: "Insufficient funds" });
    }

    // Step 4: Create transfer
    const newTransfer = await createTransfer(
      senderId,
      recipientId,
      amount,
      description,
      method
    );

    console.log("New transfer created:", newTransfer);

    // Step 5: Update sender's balance (deduct amount)
    await updateUserBalance(senderId, -amount);

    // Step 6: Update recipient's balance (add amount)
    await updateUserBalance(recipientId, amount);

    // Step 7: Log the transaction for sender
    await createTransferTransaction(senderId, amount, description, false);

    // Step 8: Log the transaction for recipient
    await createTransferTransaction(recipientId, amount, description, true);

    // Send the newly created transfer as a response
    res.status(201).json(newTransfer);
  } catch (error) {
    console.error("Error creating transfer:", error);
    console.error("Error stack:", error.stack);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});


// Delete a transfer by ID
router.delete("/:id", async (req, res) => {
  const transferId = req.params.id;
  try {
    const deletedTransfer = await deleteTransferById(transferId);
    if (!deletedTransfer) {
      return res.status(404).json({ error: "Transfer not found" }); // Change here
    }
    res
      .status(200)
      .json({
        message: "Transfer deleted successfully",
        transfer: deletedTransfer,
      });
  } catch (error) {
    console.error("Error deleting transfer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

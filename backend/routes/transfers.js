const express = require("express");
const router = express.Router();
const {
  createTransfer,
  getTransfersByUserId,
  deleteTransferById,
  updateTransfer,
} = require("../db/queries/transfers");

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
  const { userId, amount, description } = req.body;
  try {
    const newTransfer = await createTransfer(userId, amount, description);
    res.status(201).json(newTransfer);
  } catch (error) {
    console.error("Error creating transfer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a transfer by ID
router.put("/:id", async (req, res) => {
  const transferId = req.params.id;
  const updatedData = req.body;
  try {
    const updatedTransfer = await updateTransfer(transferId, updatedData);
    res.status(200).json(updatedTransfer);
  } catch (error) {
    console.error("Error updating transfer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a transfer by ID
router.delete("/:id", async (req, res) => {
  const transferId = req.params.id;
  try {
    const deletedTransfer = await deleteTransferById(transferId);
    res.status(200).json(deletedTransfer);
  } catch (error) {
    console.error("Error deleting transfer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  getAllTransactions,
  getTransactionsByUserId,
  getTransactionById,
  createTransaction,
  deleteTransactionById,
} = require("../db/queries/transactions");
const db = require('../db/connection'); 

const { getBalance, updateUserBalance } = require("../db/queries/users");

// Admin route: Get all transactions
// router.get("/", async (req, res) => {
//   try {
//     const transactions = await getAllTransactions();
//     res.status(200).json(transactions);
//   } catch (error) {
//     console.error("Error fetching all transactions:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// User route: Get all transactions for a specific user
// router.get("/user/:userId", async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     if (!userId || userId === "undefined") {
//       return res.status(400).json({ error: "Invalid user ID" });
//     }
//     const transactions = await getTransactionsByUserId(userId);
//     res.status(200).json(transactions);
//   } catch (error) {
//     console.error("Error fetching transactions:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// Get a transaction by ID
// router.get("/:id", async (req, res) => {
//   try {
//     const transaction = await getTransactionById(req.params.id);
//     if (transaction) {
//       res.status(200).json(transaction);
//     } else {
//       res.status(404).json({ error: "Transaction not found" });
//     }
//   } catch (error) {
//     console.error("Error fetching transaction:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// Create a new transaction
// router.post("/", async (req, res) => {
//   const { userId, amount, category, description, isIncoming } = req.body;
  
//   try {
//     // Create the transaction
//     const newTransaction = await createTransaction(
//       userId,
//       amount,
//       category,
//       description,
//       isIncoming
//     );

//     // Update the user balance
//     await updateUserBalance(userId, isIncoming ? amount : -amount);

//     // Get the updated balance
//     const updatedBalance = await getBalance(userId);

//     res.status(201).json({
//       transaction: newTransaction,
//       updatedBalance: updatedBalance
//     });
//   } catch (error) {
//     console.error("Error creating transaction:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// Delete a transaction by ID
// router.delete("/:id", async (req, res) => {
//   const transactionId = req.params.id;
//   try {
//     const deletedTransaction = await deleteTransactionById(transactionId);
//     if (deletedTransaction) {
//       res.status(200).json({ message: "Transaction deleted successfully", transaction: deletedTransaction });
//     } else {
//       res.status(404).json({ error: "Transaction not found" });
//     }
//   } catch (error) {
//     console.error("Error deleting transaction:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// CREATED BY GRANT AS TEMPORARY (BAD) SOLUTION TO LIST + ADD/REMOVE TRANSACTIONS

router.get('/', async (req, res) => {
  const { user_id } = req.query;
  console.log('Fetching transactions for user:', user_id); 

  if (!user_id) {
    return res.status(400).json({ message: 'User ID is required.' });
  }

  try {
    const result = await db.query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC',
      [user_id]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Failed to fetch transactions.' });
  }
});

router.post('/', async (req, res) => {
  const { userId, category, amount_in, amount_out, description, date } = req.body;

  const transactionClient = await db.connect(); 

  try {
    await transactionClient.query('BEGIN');

    await transactionClient.query(
      `INSERT INTO transactions (user_id, category, amount_in, amount_out, description, date) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, category, amount_in, amount_out, description, date]
    );

    await transactionClient.query(
      `UPDATE users 
       SET wallet_balance = wallet_balance + $1 - $2 
       WHERE user_id = $3`,
      [amount_in, amount_out, userId]
    );

    await transactionClient.query('COMMIT');
    
    res.status(200).json({ message: 'Transaction logged and wallet balance updated successfully' });
  } catch (error) {
    await transactionClient.query('ROLLBACK');
    console.error('Error logging transaction:', error);
    res.status(500).json({ message: 'Failed to log transaction and update wallet balance' });
  } finally {
    transactionClient.release();
  }
});


router.delete('/:id', async (req, res) => {
  const transactionId = req.params.id;
  const { user_id } = req.body; 

  if (!user_id) {
    return res.status(400).json({ message: 'User ID is required.' });
  }

  try {
    const result = await db.query(
      'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING id',
      [transactionId, user_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Transaction not found or not authorized to delete.' });
    }

    res.status(200).json({ message: 'Transaction deleted successfully.' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ message: 'Failed to delete transaction.' });
  }
});

module.exports = router;

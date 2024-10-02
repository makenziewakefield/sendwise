const db = require("../connection");

// Function to get all transfers for all users
const getAllTransfers = async () => {
  try {
    const query = `
      SELECT 
        t.id,
        t.sender_id,
        t.recipient_id,
        t.amount,
        t.description,
        t.method,
        u1.username AS sender,
        u2.username AS recipient,
        t.date
      FROM transfers t
      JOIN users u1 ON t.sender_id = u1.user_id
      JOIN users u2 ON t.recipient_id = u2.user_id
      ORDER BY t.date DESC;
    `;
    const { rows } = await db.query(query);
    return rows;
  } catch (err) {
    console.error("Error fetching all transfers:", err);
    throw err;
  }
};

// Function to get all transfers for a user
const getTransfersByUserId = async (userId) => {
  const query = `
    SELECT t.*, 
           s.username AS sender_username, 
           r.username AS recipient_username
    FROM transfers t
    JOIN users s ON t.sender_id = s.user_id
    JOIN users r ON t.recipient_id = r.user_id
    WHERE t.sender_id = $1 OR t.recipient_id = $1
    ORDER BY t.date DESC;
  `;
  const values = [userId];

  try {
    const { rows } = await db.query(query, values);
    return rows;
  } catch (err) {
    console.error("Error fetching transfers:", err);
    throw err;
  }
};

// Function to create a new transfer
const createTransfer = async (
  senderId,
  recipientId,
  amount,
  description,
  method
) => {
  const query = `
    INSERT INTO transfers (sender_id, recipient_id, amount, method, description)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const values = [senderId, recipientId, amount, method, description];

  try {
    const { rows } = await db.query(query, values);
    // Convert the amount to a number
    rows[0].amount = parseFloat(rows[0].amount);
    return rows[0];
  } catch (err) {
    console.error("Error creating transfer:", err);
    throw err;
  }
};

// Function to update wallet balance
const updateUserBalance = async (userId, amount) => {
  const query = `
    UPDATE users
    SET wallet_balance = wallet_balance + $2
    WHERE user_id = $1
    RETURNING wallet_balance;
  `;
  const values = [userId, amount];

  try {
    const { rows } = await db.query(query, values);
    return rows[0].wallet_balance;
  } catch (err) {
    console.error("Error updating user balance:", err);
    throw err;
  }
};

// Function to get transfer history
const getTransferHistory = async (userId) => {
  const query = `
    SELECT t.*, 
           s.username AS sender_username, 
           r.username AS recipient_username
    FROM transfers t
    JOIN users s ON t.sender_id = s.user_id
    JOIN users r ON t.recipient_id = r.user_id
    WHERE t.sender_id = $1 OR t.recipient_id = $1
    ORDER BY t.date DESC;
  `;
  const values = [userId];

  try {
    const { rows } = await db.query(query, values);
    return rows;
  } catch (err) {
    console.error("Error fetching transfer history:", err);
    throw err;
  }
};

// Function to log a transaction for transfers
const createTransferTransaction = async (userId, amount, description, isIncoming) => {
  const query = `
    INSERT INTO transactions (user_id, category_id, amount_in, amount_out, description)
    VALUES ($1, (SELECT id FROM categories WHERE name = 'Transfer'), $2, $3, $4)
    RETURNING *;
  `;

  const amountIn = isIncoming ? amount : 0;
  const amountOut = isIncoming ? 0 : amount;

  const values = [userId, amountIn, amountOut, description];

  try {
    const { rows } = await db.query(query, values);
    return rows[0];
  } catch (err) {
    console.error("Error creating transfer transaction:", err);
    throw err;
  }
};

// Function to delete a transfer by ID
const deleteTransferById = async (transferId) => {
  const query = `
    DELETE FROM transfers
    WHERE id = $1
    RETURNING *; -- This will return the deleted transfer
  `;

  const values = [transferId];

  try {
    const { rows } = await db.query(query, values);
    if (rows.length === 0) {
      return null; // No transfer was deleted
    }
    return rows[0]; // Return the deleted transfer
  } catch (err) {
    console.error("Error deleting transfer:", err);
    throw err; // Rethrow the error for handling in the router
  }
};


module.exports = {
  getAllTransfers,
  getTransfersByUserId,
  createTransfer,
  getTransferHistory,
  updateUserBalance,
  createTransferTransaction,
  deleteTransferById,
};

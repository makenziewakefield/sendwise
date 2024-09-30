const db = require("../connection");

// Function to create a new transaction
const createTransaction = async (userId, amount, category, description) => {
  const query = `
        INSERT INTO transactions (user_id, amount, category, description, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING *;
    `;
  const values = [userId, amount, category, description];

  try {
    const { rows } = await db.query(query, values);
    return rows[0]; // return the created transaction
  } catch (err) {
    console.error("Error creating transaction:", err);
    throw err; // Rethrow error for handling in the calling function
  }
};

// Function to get all transactions for a user
const getTransactionsByUserId = async (userId) => {
  const query = `
        SELECT * FROM transactions
        WHERE user_id = $1
        ORDER BY created_at DESC;
    `;
  const values = [userId];

  try {
    const { rows } = await db.query(query, values);
    return rows; // return an array of transactions
  } catch (err) {
    console.error("Error fetching transactions:", err);
    throw err;
  }
};

// Function to delete a transaction by its ID
const deleteTransactionById = async (transactionId) => {
  const query = `
        DELETE FROM transactions
        WHERE id = $1
        RETURNING *;
    `;
  const values = [transactionId];

  try {
    const { rows } = await db.query(query, values);
    return rows[0]; // return the deleted transaction
  } catch (err) {
    console.error("Error deleting transaction:", err);
    throw err;
  }
};

// Function to update a transaction
const updateTransaction = async (transactionId, updatedData) => {
  const { amount, category, description } = updatedData;
  const query = `
        UPDATE transactions
        SET amount = COALESCE($1, amount),
            category = COALESCE($2, category),
            description = COALESCE($3, description),
            updated_at = NOW()
        WHERE id = $4
        RETURNING *;
    `;
  const values = [amount, category, description, transactionId];

  try {
    const { rows } = await db.query(query, values);
    return rows[0]; // return the updated transaction
  } catch (err) {
    console.error("Error updating transaction:", err);
    throw err;
  }
};

module.exports = {
  createTransaction,
  getTransactionsByUserId,
  deleteTransactionById,
  updateTransaction,
};

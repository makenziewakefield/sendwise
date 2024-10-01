// db/queries/transactions.js
const db = require("../connection");

// Function to get all transactions
const getAllTransactions = async () => {
  const query = `
    SELECT * FROM transactions
    ORDER BY date DESC;
  `;

  try {
    const { rows } = await db.query(query);
    return rows;
  } catch (err) {
    console.error("Error fetching all transactions:", err);
    throw err;
  }
};

// Function to get all transactions for a user
const getTransactionsByUserId = async (userId) => {
  const query = `
    SELECT * FROM transactions
    WHERE user_id = $1
    ORDER BY date DESC;
  `;
  const values = [userId];

  try {
    const { rows } = await db.query(query, values);
    return rows;
  } catch (err) {
    console.error("Error fetching transactions:", err);
    throw err;
  }
};

// Function to get a transaction by its ID
const getTransactionById = async (id) => {
  const query = `
    SELECT * FROM transactions
    WHERE id = $1;
  `;
  const values = [id];

  try {
    const { rows } = await db.query(query, values);
    return rows[0];
  } catch (err) {
    console.error("Error fetching transaction by ID:", err);
    throw err;
  }
};

// Function to create a new transaction
const createTransaction = async (
  userId,
  amount,
  categoryId,
  description,
  isIncoming
) => {
  const query = `
    INSERT INTO transactions (user_id, category_id, amount_in, amount_out, description)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  // If isIncoming is true, assign amount to amount_in, else assign it to amount_out
  const amountIn = isIncoming ? amount : 0.0;
  const amountOut = isIncoming ? 0.0 : amount;

  const values = [userId, categoryId, amountIn, amountOut, description];

  try {
    const { rows } = await db.query(query, values);
    return rows[0]; // return the newly created transaction
  } catch (err) {
    console.error("Error creating transaction:", err);
    throw err;
  }
};

/**
 * Deletes a transaction by its ID
 * @param {number} id - The ID of the transaction to delete
 * @returns {Promise} - Resolves to the result of the deletion query
 */
const deleteTransactionById = async (id) => {
  const query = `
    DELETE FROM transactions 
    WHERE id = $1 
    RETURNING *;
  `;

  try {
    const result = await db.query(query, [id]);
    return result.rows[0]; // Returning the deleted transaction details if needed
  } catch (error) {
    throw new Error(`Error deleting transaction: ${error.message}`);
  }
};

module.exports = {
  getAllTransactions,
  getTransactionsByUserId,
  getTransactionById,
  createTransaction,
  deleteTransactionById,
};

const db = require("../connection");

// Function to create a new transfer
const createTransfer = async (userId, amount, description) => {
  const query = `
        INSERT INTO transfers (user_id, amount, description, created_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING *;
    `;
  const values = [userId, amount, description];

  try {
    const { rows } = await db.query(query, values);
    return rows[0]; // return the created transfer
  } catch (err) {
    console.error("Error creating transfer:", err);
    throw err; // Rethrow error for handling in the calling function
  }
};

// Function to get all transfers for a user
const getTransfersByUserId = async (userId) => {
  const query = `
        SELECT * FROM transfers
        WHERE user_id = $1
        ORDER BY created_at DESC;
    `;
  const values = [userId];

  try {
    const { rows } = await db.query(query, values);
    return rows; // return an array of transfers
  } catch (err) {
    console.error("Error fetching transfers:", err);
    throw err;
  }
};

// Function to delete a transfer by its ID
const deleteTransferById = async (transferId) => {
  const query = `
        DELETE FROM transfers
        WHERE id = $1
        RETURNING *;
    `;
  const values = [transferId];

  try {
    const { rows } = await db.query(query, values);
    return rows[0]; // return the deleted transfer
  } catch (err) {
    console.error("Error deleting transfer:", err);
    throw err;
  }
};

// Function to update a transfer
const updateTransfer = async (transferId, updatedData) => {
  const { amount, description } = updatedData;
  const query = `
        UPDATE transfers
        SET amount = COALESCE($1, amount),
            description = COALESCE($2, description),
            updated_at = NOW()
        WHERE id = $3
        RETURNING *;
    `;
  const values = [amount, description, transferId];

  try {
    const { rows } = await db.query(query, values);
    return rows[0]; // return the updated transfer
  } catch (err) {
    console.error("Error updating transfer:", err);
    throw err;
  }
};

module.exports = {
  createTransfer,
  getTransfersByUserId,
  deleteTransferById,
  updateTransfer,
};

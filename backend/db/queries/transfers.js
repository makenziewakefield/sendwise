const db = require("../connection");

// Function to get all transfers for a user
const getTransfersByUserId = async (userId) => {
  const query = `
    SELECT * FROM transfers
    WHERE sender_id = $1 OR recipient_id = $1
    ORDER BY date DESC;
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
const createTransfer = async (senderId, recipientId, amount, description) => {
  const query = `
    INSERT INTO transfers (sender_id, recipient_id, amount, description)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [senderId, recipientId, amount, description];

  try {
    const { rows } = await db.query(query, values);
    return rows[0];
  } catch (err) {
    console.error("Error creating transfer:", err);
    throw err;
  }
};

// Function to update a transfer by ID
const updateTransfer = async (transferId, updatedData) => {
  const { recipientId, amount, description } = updatedData;
  const query = `
    UPDATE transfers
    SET recipient_id = COALESCE($1, recipient_id),
        amount = COALESCE($2, amount),
        description = COALESCE($3, description)
    WHERE id = $4
    RETURNING *;
  `;
  const values = [recipientId, amount, description, transferId];

  try {
    const { rows } = await db.query(query, values);
    return rows[0];
  } catch (err) {
    console.error("Error updating transfer:", err);
    throw err;
  }
};

// Function to delete a transfer by ID
const deleteTransferById = async (transferId) => {
  const query = `
    DELETE FROM transfers
    WHERE id = $1
    RETURNING *;
  `;
  const values = [transferId];

  try {
    const { rows } = await db.query(query, values);
    return rows[0];
  } catch (err) {
    console.error("Error deleting transfer:", err);
    throw err;
  }
};

module.exports = {
  getTransfersByUserId,
  createTransfer,
  updateTransfer,
  deleteTransferById,
};

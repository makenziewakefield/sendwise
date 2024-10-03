const db = require("../connection");

const getUsers = () => {
  return db.query("SELECT * FROM users;").then((data) => {
    return data.rows;
  });
};

const getUserById = (userId) => {
  return db
    .query("SELECT * FROM users WHERE user_id = $1;", [userId])
    .then((data) => {
      return data.rows[0]; // Return the first matching user
    });
};

const addUser = ({ username, email, password, wallet_balance }) => {
  return db
    .query(
      "INSERT INTO users (username, email, password, wallet_balance) VALUES ($1, $2, $3, $4) RETURNING *;",
      [username, email, password, wallet_balance]
    )
    .then((data) => {
      return data.rows[0]; // Return the newly created user
    });
};

const updateUserById = (userId, { username, email, wallet_balance }) => {
  return db
    .query(
      `UPDATE users SET
      username = COALESCE($1, username),
      email = COALESCE($2, email),
      wallet_balance = COALESCE($3, wallet_balance)
    WHERE user_id = $4
    RETURNING *;`,
      [username, email, wallet_balance, userId]
    )
    .then((data) => {
      return data.rows[0]; // Return the updated user
    });
};

const getUserBalance = async (userId) => {
  try {
    const { rows } = await db.query(
      "SELECT wallet_balance FROM users WHERE user_id = $1",
      [userId]
    );
    if (rows.length === 0) {
      throw new Error("User not found");
    }
    return parseFloat(rows[0].wallet_balance); // Convert to float
  } catch (err) {
    console.error("Error fetching user balance:", err);
    throw err;
  }
};

const deleteUserById = (userId) => {
  return db
    .query("DELETE FROM users WHERE user_id = $1 RETURNING *;", [userId])
    .then((data) => {
      return data.rows[0]; // Return the deleted user, if needed
    });
};

module.exports = {
  getUsers,
  getUserById,
  addUser,
  updateUserById,
  getUserBalance,
  deleteUserById,
};

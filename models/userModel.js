const { poolPromise } = require("../dbConfig");

// Get user by username
async function getUserByUsername(username) {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("username", username)
      .query("SELECT * FROM Users WHERE username = @username");
    return result.recordset[0] || null;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
}

// Create new user
async function createUser(username, passwordHash, role) {
  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("username", username)
      .input("passwordHash", passwordHash)
      .input("role", role)
      .query(
        "INSERT INTO Users (username, passwordHash, role) VALUES (@username, @passwordHash, @role)",
      );
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
}

async function getAllUsers(filters = {}) {
  try {
    const pool = await poolPromise;
    let query = "SELECT user_id, username, role FROM Users WHERE 1=1";
    const request = pool.request();

    if (filters.role) {
      query += " AND role = @role";
      request.input("role", filters.role);
    }
    if (filters.username) {
      query += " AND username LIKE @username";
      request.input("username", "%" + filters.username + "%");
    }

    query += " ORDER BY user_id ASC";
    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
}

module.exports = {
  getUserByUsername,
  createUser,
  getAllUsers,
};

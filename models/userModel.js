const { poolPromise } = require('../dbConfig');

// Get user by username
async function getUserByUsername(username) {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('username', username)
            .query('SELECT * FROM Users WHERE username = @username');
        return result.recordset[0] || null;
    } catch (error) {
        console.error('Database error:', error);
        throw error;
    }
}

// Create new user
async function createUser(username, passwordHash, role) {
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('username', username)
            .input('passwordHash', passwordHash)
            .input('role', role)
            .query('INSERT INTO Users (username, passwordHash, role) VALUES (@username, @passwordHash, @role)');
    } catch (error) {
        console.error('Database error:', error);
        throw error;
    }
}

module.exports = {
    getUserByUsername,
    createUser
};
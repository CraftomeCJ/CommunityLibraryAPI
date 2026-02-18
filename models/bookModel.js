const { poolPromise } = require('../dbConfig');

// Get all books
async function getAllBooks() {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Books');
        return result.recordset;
    } catch (error) {
        console.error('Database error:', error);
        throw error;
    }
}

// Get book by id
async function getBookById(bookId) {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('bookId', bookId)
            .query('SELECT * FROM Books WHERE book_id = @bookId');
        return result.recordset[0] || null;
    } catch (error) {
        console.error('Database error:', error);
        throw error;
    }
}

// Create a new book
async function createBook({ title, author, availability }) {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('title', title)
            .input('author', author)
            .input('availability', availability)
            .query(
                `INSERT INTO Books (title, author, availability)
                 OUTPUT INSERTED.book_id
                 VALUES (@title, @author, @availability)`
            );
        return result.recordset[0].book_id;
    } catch (error) {
        console.error('Database error:', error);
        throw error;
    }
}

// Update book
async function updateBook(bookId, { title, author, availability }) {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('bookId', bookId)
            .input('title', title)
            .input('author', author)
            .input('availability', availability)
            .query(
                `UPDATE Books SET title = @title, author = @author, availability = @availability
                 WHERE book_id = @bookId`
            );
        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.error('Database error:', error);
        throw error;
    }
}

// Delete book
async function deleteBook(bookId) {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('bookId', bookId)
            .query('DELETE FROM Books WHERE book_id = @bookId');
        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.error('Database error:', error);
        throw error;
    }
}

// Update book availability
async function updateBookAvailability(bookId, availability) {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('bookId', bookId)
            .input('availability', availability)
            .query('UPDATE Books SET availability = @availability WHERE book_id = @bookId');
        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.error('Database error:', error);
        throw error;
    }
}

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    updateBookAvailability
};
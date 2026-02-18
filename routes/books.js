const express = require('express');
const { verifyJWT, authorize } = require('../middlewares/auth');
const bookController = require('../controllers/bookController');
const router = express.Router();

// Get all books - accessible by members and librarians
router.get('/', verifyJWT, authorize(['member', 'librarian']), bookController.getAllBooks);

// Get one book
router.get('/:bookId', verifyJWT, authorize(['member', 'librarian']), bookController.getBookById);

// Create book - only librarians
router.post('/', verifyJWT, authorize(['librarian']), bookController.createBook);

// Update book - only librarians
router.put('/:bookId', verifyJWT, authorize(['librarian']), bookController.updateBook);

// Delete book - only librarians
router.delete('/:bookId', verifyJWT, authorize(['librarian']), bookController.deleteBook);

// Update book availability - only librarians
router.put('/:bookId/availability', verifyJWT, authorize(['librarian']), bookController.updateBookAvailability);

module.exports = router;
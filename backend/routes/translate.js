const express = require('express');
const { translateText, getHistory } = require('../controllers/translate');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public route for translation
router.post('/', translateText);

// Protected route for history
router.get('/history', protect, getHistory);

module.exports = router;

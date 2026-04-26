const express = require('express');
const { register, login, googleInit, googleComplete, updateAvatar } = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google-init', googleInit);
router.post('/google-complete', googleComplete);
router.put('/avatar', protect, updateAvatar);

module.exports = router;

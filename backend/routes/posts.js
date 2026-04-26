const express = require('express');
const { getPosts, createPost, addReply } = require('../controllers/posts');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getPosts)
  .post(protect, createPost);

router.post('/:id/reply', protect, addReply);

module.exports = router;

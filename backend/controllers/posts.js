const Post = require('../models/Post');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    req.body.userName = req.user.name;
    // Avatar is optional in model but we'll pass it from frontend
    
    const post = await Post.create(req.body);
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

// @desc    Add a reply
// @route   POST /api/posts/:id/reply
// @access  Private
exports.addReply = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return next(new ErrorResponse(`Post not found`, 404));
    }

    const reply = {
      user: req.user.id,
      userName: req.user.name,
      content: req.body.content
    };

    post.replies.push(reply);
    await post.save();

    res.status(200).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

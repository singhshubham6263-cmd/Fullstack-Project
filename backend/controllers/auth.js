const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return next(new ErrorResponse('Please provide an email and password', 400));
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Initialize Google Login (Check if user exists)
// @route   POST /api/auth/google-init
// @access  Public
exports.googleInit = async (req, res, next) => {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return next(new ErrorResponse('Please provide an email and name', 400));
    }

    // Check if user already exists
    const user = await User.findOne({ email });

    if (user) {
      // User exists, log them in
      sendTokenResponse(user, 200, res);
    } else {
      // User does not exist, tell frontend to prompt for password
      res.status(200).json({
        success: true,
        requiresPassword: true,
        email,
        name
      });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Complete Google Registration
// @route   POST /api/auth/google-complete
// @access  Public
exports.googleComplete = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
      return next(new ErrorResponse('Please provide name, email, and password', 400));
    }

    // Check if user exists (edge case)
    let user = await User.findOne({ email });
    if (user) {
       return next(new ErrorResponse('User already exists', 400));
    }

    // Create user
    user = await User.create({
      name,
      email,
      password,
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Update User Avatar
// @route   PUT /api/auth/avatar
// @access  Private
exports.updateAvatar = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: req.body.avatar },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: user.avatar
    });
  } catch (err) {
    next(err);
  }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const secret = process.env.JWT_SECRET || 'fallback_secret_for_deployment_debugging';
  const token = jwt.sign({ id: user._id }, secret, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar
    }
  });
};

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const errorHandler = require('./middleware/error');

// Route files
const auth = require('./routes/auth');
const translate = require('./routes/translate');
const phrases = require('./routes/phrases');
const posts = require('./routes/posts');

const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100 // 100 requests per 10 mins
});
app.use(limiter);

// Mount routers
app.use('/api/auth', auth);
app.use('/api/translate', translate);
app.use('/api/phrases', phrases);
app.use('/api/posts', posts);

// Error handler middleware
app.use(errorHandler);

module.exports = app;

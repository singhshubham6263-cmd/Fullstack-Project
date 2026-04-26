require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

// Connect to database
// NOTE: We don't connect immediately because MongoDB URI might not be valid yet
// This will just fail gracefully and allow server to start for API mocking
try {
  if (process.env.MONGO_URI) {
     connectDB();
  }
} catch(e) {
  console.log('Failed to connect to MongoDB initially', e);
}

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});

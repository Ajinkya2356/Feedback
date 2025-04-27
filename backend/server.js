const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const feedbackRoutes = require('./routes/feedback');

const app = express();

// Enable CORS
app.use(cors()); // Allow all origins for simplicity, configure specific origins in production

// Body parser
app.use(express.json());

// Mount routers
app.use('/feedback', feedbackRoutes);

const PORT = process.env.PORT || 5001;

const server = app.listen(
  PORT,
  console.log(`Server running on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

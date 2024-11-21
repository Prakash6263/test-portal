const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./Config/db');
const questionRoutes = require('./Routes/question'); // Corrected route import
const adminRoutes = require('./Routes/admin');
const candidateRoutes = require('./Routes/user'); // Corrected route import
require('dotenv').config();
const cors = require('cors');

const app = express();

// Connect to MongoDB
connectDB();

// Allowed Origins
const allowedOrigins = [
  'http://localhost:3000', 
  'http://localhost:3001', 
  'https://aptitude-test-ojtq.onrender.com'
];

// CORS Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error(`CORS Error: Origin ${origin} not allowed`)); // Reject the request
    }
  },
  credentials: true // Allow cookies and other credentials
}));

// Preflight Request Handler (OPTIONS)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', allowedOrigins.includes(req.headers.origin) ? req.headers.origin : '');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200); // Preflight request successful
  } else {
    next();
  }
});

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/questions', questionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/candidates', candidateRoutes);

// Root Route
app.get('/', (req, res) => {
  res.status(200).json("Server is running");
});

// Start Server
const PORT = 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;

require('dotenv').config(); // Load environment variables

const express = require('express');
const cors = require('cors');
const http = require('http');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/database');
const mainRouter = require('./routes/router');

// Updated CORS options
const corsOptions = {
  origin: '*', // Replace with your frontend's origin
  optionsSuccessStatus: 200,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Authorization', 'Content-Type', 'ngrok-skip-browser-warning'], // Allow custom headers
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});

connectDB();

const app = express();
const server = http.createServer(app);

app.use(cors(corsOptions)); // Use CORS with updated options
app.options('*', cors(corsOptions)); // Handle preflight requests
app.use(express.json());
// app.use(limiter);

app.use('/api', mainRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).send("Sorry, that route doesn't exist.");
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => { 
    console.log(`Server running on port ${PORT}`);
});
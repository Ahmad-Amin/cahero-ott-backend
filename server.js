require('dotenv').config(); // Load environment variables

const express = require('express');
const cors = require('cors');
const http = require('http');

const connectDB = require('./config/database'); 
const mainRouter = require('./routes/router');

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
};

connectDB();

const app = express();
const server = http.createServer(app);

app.use(cors(corsOptions));
app.use(express.json());

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
server.listen(PORT, () => { // Change app.listen to server.listen
    console.log(`Server running on port ${PORT}`);
});

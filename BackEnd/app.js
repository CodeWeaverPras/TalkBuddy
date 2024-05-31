require("express-async-errors");
require("dotenv").config();
const express = require('express');
const app = express();
const connectDatabase = require('./config/databaseConfig');
const colors = require('colors');
const morgan = require('morgan');
const cors = require("cors");
const chats = require('./data/chatdata');
const Routes = require('./routes/index.js');
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/api/v1', Routes);

// Default route
app.get('/', (req, res) => {
  res.send('<h1>Welcome to the TalkBuddy Server!</h1>');
});

// Route error
app.use((req, res, next) => {
  res.status(404).json({ Message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error for debugging purposes
  res.status(500).json({ message: 'Something went wrong' });
});

app.listen(port, async () => {
  await connectDatabase();
  console.log(`Server is up and running on: http://localhost:${port}`.rainbow.bgWhite);
});

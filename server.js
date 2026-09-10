const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Look at your terminal to see your database link
console.log("WHAT APP SEES:", process.env.MONGODB_URI);

// Connect to MongoDB Database
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });

// --- LINKED MODULE 2 API ROUTES ---
const authRoute = require('./routes/auth');
const blogRoute = require('./routes/blogs');

app.use('/api/auth', authRoute);   // Handles User Registration & Login
app.use('/api/blogs', blogRoute);  // Handles Creating & Reading Blog Posts
// ----------------------------------

app.get('/', (req, res) => {
  res.send("Your backend server is up and running!");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
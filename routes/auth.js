const router = require('express').Router();
const User = require('../models/User');

// 1. USER REGISTRATION ROUTE
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const newUser = new User({
      username,
      email,
      password
    });

    const savedUser = await newUser.save();
    res.status(201).json({
      message: "User registered successfully!",
      userId: savedUser._id
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. USER LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    if (user.password !== req.body.password) {
      return res.status(400).json({ error: "Wrong password!" });
    }

    res.status(200).json({
      message: "Login successful!",
      username: user.username,
      userId: user._id
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
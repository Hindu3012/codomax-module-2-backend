const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');

// 1. USER REGISTRATION ROUTE
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: "User registered successfully!",
      userId: savedUser._id
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// 2. USER LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found!"
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        error: "Wrong password!"
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d'
      }
    );

    res.status(200).json({
      message: "Login successful!",
      username: user.username,
      userId: user._id,
      token: token
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// 3. GET USER PROFILE - PRIVATE
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password');

    if (!user) {
      return res.status(404).json({
        error: "User not found!"
      });
    }

    res.status(200).json({
      message: "Profile fetched successfully!",
      user: user
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// 4. LOGOUT ROUTE
router.post('/logout', authMiddleware, (req, res) => {
  res.status(200).json({
    message: "Logout successful! Please remove the token from the client."
  });
});

module.exports = router;
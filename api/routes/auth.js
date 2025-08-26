const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const salt = bcrypt.genSaltSync(10);
const secret = process.env.secret;

// Register route
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  
  // Validate input
  if (!username || !password) {
    return res.status(400).json({ 
      message: 'Username and password are required' 
    });
  }

  if (password.length < 6) {
    return res.status(400).json({ 
      message: 'Password must be at least 6 characters long' 
    });
  }

  try {
    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ 
        message: 'This username is already registered. Please try a different one.' 
      });
    }

    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    
    // Don't send password back
    const { password: _, ...userResponse } = userDoc.toObject();
    res.status(201).json({ 
      message: 'Registration successful!', 
      user: userResponse 
    });
  } catch (e) {
    console.error('Registration error:', e);
    res.status(500).json({ 
      message: 'Registration failed. Please try again.' 
    });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ 
        message: 'Username and password are required' 
      });
    }

    const userDoc = await User.findOne({ username });
    if (!userDoc) {
      return res.status(404).json({ 
        message: "This username doesn't exist. Please try registering first." 
      });
    }
    
    const passOk = bcrypt.compareSync(password, userDoc.password);
    const id = userDoc.id;
    
    if (passOk) {
      const token = jwt.sign({ username, id: userDoc._id }, secret, { expiresIn: '1h' });
      return res.json({ 
        message: 'Login successful!',
        username, 
        id, 
        token 
      });
    } else {
      return res.status(401).json({ 
        message: 'Incorrect password. Please try again.' 
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      message: 'Login failed. Please try again.' 
    });
  }
});

// Profile route
router.get('/profile', (req, res) => {
  const token = req.headers.authorization;
  const tokenParts = token.split(' ');
  const toker = tokenParts[1];
  if (token) {
    jwt.verify(toker, secret, {}, (err, info) => {
      if (err) throw err;
      res.json(info);
    });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  res.cookie('token', '').json('ok');
});

module.exports = router;

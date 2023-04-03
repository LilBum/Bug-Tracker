const express = require('express');
const router = express.Router();
const userModel = require('../../Model/userModel');
const bcrypt = require('bcrypt');

const HTTP_OK = 200;
const HTTP_CREATED = 201;
const HTTP_BAD_REQUEST = 400;
const HTTP_UNAUTHORIZED = 401;
const HTTP_NOT_FOUND = 404;
const HTTP_INTERNAL_SERVER_ERROR = 500;

// Create a new user
router.post('/users', async (req, res) => {
  try {
    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new userModel({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role,
    });
    const savedUser = await newUser.save();
    res
      .status(HTTP_CREATED)
      .json({ message: 'User created successfully', user: savedUser });
  } catch (err) {
    res.status(HTTP_BAD_REQUEST).json({ error: err.message });
  }
});

// Update a user
router.put('/users/:id', async (req, res) => {
  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        password: await bcrypt.hash(req.body.password, 10),
        role: req.body.role,
      },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(HTTP_NOT_FOUND).json({ error: 'User not found' });
    }
    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    res.status(HTTP_BAD_REQUEST).json({ error: err.message });
  }
});

// Log in a user
router.post('/login', async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(HTTP_UNAUTHORIZED)
        .json({ error: 'Incorrect email or password' });
    }
    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordValid) {
      return res
        .status(HTTP_UNAUTHORIZED)
        .json({ error: 'Incorrect email or password' });
    }
    // Store the user information in a secure HTTP-only cookie
    res.cookie(
      'user',
      { id: user._id, name: user.name, role: user.role },
      { httpOnly: true }
    );
    res.json({ message: 'Logged in successfully' });
  } catch (err) {
    res.status(HTTP_BAD_REQUEST).json({ error: err.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await userModel.find().select('-password');
    if (users.length === 0) {
      return res.status(HTTP_NOT_FOUND).json({ error: 'No users found' });
    }
    res.json(users);
  } catch (err) {
    res.status(HTTP_INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
});

module.exports = router;

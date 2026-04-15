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
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(HTTP_BAD_REQUEST)
        .json({ error: 'Name, email, and password are required' });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(HTTP_BAD_REQUEST)
        .json({ error: 'A user with that email already exists' });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role,
    });
    const savedUser = await newUser.save();
    const user = savedUser.toObject();
    delete user.password;

    res
      .status(HTTP_CREATED)
      .json({ message: 'User created successfully', user });
  } catch (err) {
    res.status(HTTP_BAD_REQUEST).json({ error: err.message });
  }
});

// Update a user
router.put('/users/:id', async (req, res) => {
  try {
    const updates = {};

    if (req.body.name) updates.name = req.body.name;
    if (req.body.email) updates.email = req.body.email;
    if (req.body.role) updates.role = req.body.role;
    if (req.body.password) {
      updates.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).select('-password');

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
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(HTTP_BAD_REQUEST)
        .json({ error: 'Email and password are required' });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(HTTP_UNAUTHORIZED)
        .json({ error: 'Incorrect email or password' });
    }
    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(HTTP_UNAUTHORIZED)
        .json({ error: 'Incorrect email or password' });
    }
    // Store the user information in a secure HTTP-only cookie
    res.cookie(
      'user',
      { id: user._id, name: user.name, role: user.role },
      { httpOnly: true, sameSite: 'lax' }
    );
    res.json({
      message: 'Logged in successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
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

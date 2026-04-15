const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const userModel = require('../../Model/userModel');
const bcrypt = require('bcrypt');

const HTTP_OK = 200;
const HTTP_CREATED = 201;
const HTTP_BAD_REQUEST = 400;
const HTTP_UNAUTHORIZED = 401;
const HTTP_NOT_FOUND = 404;
const HTTP_INTERNAL_SERVER_ERROR = 500;

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many login attempts, please try again later' },
});

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_ROLES = new Set(['admin', 'user']);

function normalizeString(value, fieldName, maxLength) {
  if (typeof value !== 'string') {
    throw new Error(`${fieldName} must be a string`);
  }

  const normalized = value.trim();

  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }

  if (normalized.length > maxLength) {
    throw new Error(`${fieldName} must be ${maxLength} characters or fewer`);
  }

  return normalized;
}

function normalizeEmail(value) {
  const email = normalizeString(value, 'Email', 254).toLowerCase();

  if (!EMAIL_PATTERN.test(email)) {
    throw new Error('Email must be valid');
  }

  return email;
}

function normalizePassword(value) {
  const password = normalizeString(value, 'Password', 128);

  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }

  return password;
}

function normalizeRole(value) {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const role = normalizeString(value, 'Role', 20).toLowerCase();

  if (!VALID_ROLES.has(role)) {
    throw new Error('Role must be either admin or user');
  }

  return role;
}

function parseObjectId(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw new Error('Invalid user id');
  }

  return new mongoose.Types.ObjectId(id);
}

// Create a new user
router.post('/users', authLimiter, async (req, res) => {
  try {
    const name = normalizeString(req.body.name, 'Name', 100);
    const email = normalizeEmail(req.body.email);
    const password = normalizePassword(req.body.password);
    const role = normalizeRole(req.body.role);

    const existingUser = await userModel.findOne({ email }).exec();
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
router.put('/users/:id', authLimiter, async (req, res) => {
  try {
    const userId = parseObjectId(req.params.id);
    const updates = {};

    if (req.body.name !== undefined) {
      updates.name = normalizeString(req.body.name, 'Name', 100);
    }

    if (req.body.email !== undefined) {
      updates.email = normalizeEmail(req.body.email);
    }

    if (req.body.role !== undefined) {
      updates.role = normalizeRole(req.body.role);
    }

    if (req.body.password) {
      updates.password = await bcrypt.hash(normalizePassword(req.body.password), 10);
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
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
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = normalizeString(req.body.password, 'Password', 128);

    const user = await userModel.findOne({ email }).exec();
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
router.get('/users', authLimiter, async (req, res) => {
  try {
    const users = await userModel.find({}).select('-password').exec();
    if (users.length === 0) {
      return res.status(HTTP_NOT_FOUND).json({ error: 'No users found' });
    }
    res.json(users);
  } catch (err) {
    res.status(HTTP_INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
});

module.exports = router;

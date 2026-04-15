const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const bugLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 150,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later' },
});

const bugSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    steps: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    priority: {
      type: Number,
      enum: [1, 2, 3],
      default: 2,
    },
    assigned: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    creator: {
      type: String,
      default: 'Unassigned',
      trim: true,
      maxlength: 100,
    },
    version: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Bug = mongoose.models.Bug || mongoose.model('Bug', bugSchema);

function parseObjectId(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw new Error('Invalid bug id');
  }

  return new mongoose.Types.ObjectId(id);
}

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

function normalizePriority(value) {
  const priority = Number.parseInt(value, 10);

  if (![1, 2, 3].includes(priority)) {
    throw new Error('Priority must be 1, 2, or 3');
  }

  return priority;
}

function normalizeCompleted(value) {
  if (typeof value === 'boolean') {
    return value;
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  throw new Error('Completed must be a boolean');
}

function normalizeBugInput(body, { partial = false } = {}) {
  const bug = {};

  if (!partial || body.name !== undefined) {
    bug.name = normalizeString(body.name, 'Name', 120);
  }

  if (!partial || body.description !== undefined) {
    bug.description = normalizeString(body.description, 'Description', 2000);
  }

  if (!partial || body.steps !== undefined) {
    bug.steps = normalizeString(body.steps, 'Steps', 2000);
  }

  if (!partial || body.priority !== undefined) {
    bug.priority = normalizePriority(body.priority);
  }

  if (!partial || body.assigned !== undefined) {
    bug.assigned = normalizeString(body.assigned, 'Assigned', 100);
  }

  if (body.creator !== undefined) {
    bug.creator = normalizeString(body.creator, 'Creator', 100);
  } else if (!partial) {
    bug.creator = 'Unassigned';
  }

  if (!partial || body.version !== undefined) {
    bug.version = normalizeString(body.version, 'Version', 50);
  }

  if (body.completed !== undefined) {
    bug.completed = normalizeCompleted(body.completed);
  } else if (!partial) {
    bug.completed = false;
  }

  return bug;
}

// Retrieve all bugs
router.get('/', bugLimiter, async (req, res) => {
  try {
    const bugs = await Bug.find({})
      .sort({ completed: 1, priority: 1, createdAt: -1 })
      .exec();
    res.json(bugs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get a specific bug by id
router.get('/:id', bugLimiter, async (req, res) => {
  try {
    const bugId = parseObjectId(req.params.id);
    const bug = await Bug.findById(bugId).exec();

    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }

    res.status(200).json(bug);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Create a new bug
router.post('/', bugLimiter, async (req, res) => {
  try {
    const bug = new Bug(normalizeBugInput(req.body));
    const savedBug = await bug.save();
    res.status(201).json(savedBug);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

// Update a bug
router.patch('/:id', bugLimiter, async (req, res) => {
  try {
    const bugId = parseObjectId(req.params.id);
    const bug = await Bug.findByIdAndUpdate(
      bugId,
      normalizeBugInput(req.body, { partial: true }),
      {
        new: true,
        runValidators: true,
      }
    ).exec();

    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }

    res.json(bug);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

// Delete a bug
router.delete('/:id', bugLimiter, async (req, res) => {
  try {
    const bugId = parseObjectId(req.params.id);
    const deletedBug = await Bug.findByIdAndDelete(bugId).exec();

    if (!deletedBug) {
      return res.status(404).json({ message: 'Bug not found' });
    }

    res.json({ message: 'Bug deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const bugSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    steps: {
      type: String,
      required: true,
      trim: true,
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
    },
    creator: {
      type: String,
      default: 'Unassigned',
      trim: true,
    },
    version: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Bug = mongoose.models.Bug || mongoose.model('Bug', bugSchema);

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function normalizeBugInput(body) {
  const bug = {
    name: body.name,
    description: body.description,
    steps: body.steps,
    priority:
      body.priority === undefined ? undefined : Number.parseInt(body.priority, 10),
    assigned: body.assigned,
    creator: body.creator,
    version: body.version,
    completed: body.completed,
  };

  Object.keys(bug).forEach((key) => {
    if (bug[key] === undefined || bug[key] === '') {
      delete bug[key];
    }
  });

  return bug;
}

// Retrieve all bugs
router.get('/', async (req, res) => {
  try {
    const bugs = await Bug.find().sort({ completed: 1, priority: 1, createdAt: -1 });
    res.json(bugs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get a specific bug by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid bug id' });
  }

  try {
    const bug = await Bug.findById(id);

    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }

    res.status(200).json(bug);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Create a new bug
router.post('/', async (req, res) => {
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
router.patch('/:id', async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid bug id' });
  }

  try {
    const bug = await Bug.findByIdAndUpdate(id, normalizeBugInput(req.body), {
      new: true,
      runValidators: true,
    });

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
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid bug id' });
  }

  try {
    const deletedBug = await Bug.findByIdAndDelete(id);

    if (!deletedBug) {
      return res.status(404).json({ message: 'Bug not found' });
    }

    res.json({ message: 'Bug deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

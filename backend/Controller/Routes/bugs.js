const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define the routes

// Get a specific bug by id
router.get('/:id', async (req, res) => {
  console.log('Fetching bug with ID:', req.params.id);

  try {
    const bug = await Bug.findById(req.params.id);

    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }

    res.status(200).json(bug);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Retrieve all bugs
router.get('/', async (req, res) => {
  try {
    const bugs = await Bug.find();
    res.json(bugs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create a new bug
router.post('/', async (req, res) => {
  const { name, description, steps, priority, assigned } = req.body;
  const bug = new Bug({
    name,
    description,
    steps,
    priority,
    assigned,
    creator: 'Alex Urs-Badet', // set the creator property to your username or any other value you want
    version: 1, // set the initial version to 1 or any other value you want
    time: Date.now(), // set the time property to the current date and time
    completed: false, // set the completed property to false initially
  });
  console.log(priority);
  await bug.save();
  res.json(bug);
});

// Update a bug
router.patch('/bugId', async (req, res) => {
  const { id } = req.params;
  const { name, description, steps, priority, assigned, version, completed } =
    req.body;

  try {
    const bug = await Bug.findByIdAndUpdate(
      id,
      {
        name,
        description,
        steps,
        priority,
        assigned,
        version,
        completed,
      },
      { new: true }
    );

    res.json(bug);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete a bug
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Bug.findByIdAndDelete(id);

    res.json({ message: 'Bug deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Define the bug schema and model
const bugSchema = new mongoose.Schema({
  name: String,
  description: String,
  steps: String,
  priority: Number,
  assigned: String,
  creator: String,
  version: Number,
  time: { type: Date, default: Date.now },
  completed: Boolean,
});

const Bug = mongoose.model('Bug', bugSchema);

module.exports = router;

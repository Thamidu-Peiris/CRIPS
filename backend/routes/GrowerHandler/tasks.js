const express = require('express');
const router = express.Router();
const GrowerTask = require('../../models/GrowerHandler/GrowerTasks'); // Adjust the path to the model

// POST route to assign a new task
router.post('/', async (req, res) => {
  try {
    const { taskName, cutterName, priority, dueDate } = req.body;

    // Validate the incoming data
    if (!taskName || !cutterName || !priority || !dueDate) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create a new task
    const newTask = new GrowerTask({
      taskName,
      cutterName,
      priority,
      dueDate,
    });

    // Save the task to the database
    await newTask.save();

    res.status(201).json({ message: 'Task assigned successfully', task: newTask });
  } catch (error) {
    console.error('Error assigning task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET route to fetch all tasks (for verification)
router.get('/', async (req, res) => {
  try {
    const tasks = await GrowerTask.find();
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
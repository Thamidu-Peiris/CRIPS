const GrowerTask = require('../../models/GrowerHandler/GrowerTasks');

// Create a new task
const createTask = async (req, res) => {
  try {
    const { taskName, cutterName, priority, dueDate } = req.body;

    // Validate required fields
    if (!taskName || !cutterName || !priority || !dueDate) {
      return res.status(400).json({ message: "All fields are required" });
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

    res.status(201).json({ message: "Task assigned successfully", task: newTask });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Server error while creating task", error: error.message });
  }
};

// Get all tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await GrowerTask.find();
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server error while fetching tasks", error: error.message });
  }
};

module.exports = { createTask, getTasks };
// CRIPS\backend\controllers\GrowerHandler\taskController.js
const GrowerTask = require('../../models/GrowerHandler/GrowerTasks');

// Create a new task
const createTask = async (req, res) => {
  try {
    const { taskName, cutterName, priority, dueDate, status } = req.body;

    // Validate required fields
    if (!taskName || !cutterName || !priority || !dueDate || !status) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new task
    const newTask = new GrowerTask({
      taskName,
      cutterName,
      priority,
      dueDate,
      status,
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

// Update a task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { taskName, cutterName, priority, dueDate, status } = req.body;

    // Validate required fields
    if (!taskName || !cutterName || !priority || !dueDate || !status) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updatedTask = await GrowerTask.findByIdAndUpdate(
      id,
      { taskName, cutterName, priority, dueDate, status },
      { new: true } // Return the updated document
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Server error while updating task", error: error.message });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTask = await GrowerTask.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Server error while deleting task", error: error.message });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
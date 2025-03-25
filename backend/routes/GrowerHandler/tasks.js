const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTask, deleteTask } = require('../../controllers/GrowerHandler/taskController');

// POST route to assign a new task
router.post('/', createTask);

// GET route to fetch all tasks
router.get('/', getTasks);

// PUT route to update a task
router.put('/:id', updateTask);

// DELETE route to delete a task
router.delete('/:id', deleteTask);

module.exports = router;
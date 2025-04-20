// backend\models\GrowerHandler\GrowerTasks.js
const mongoose = require('mongoose');

const growerTaskSchema = new mongoose.Schema({
  taskName: {
    type: String,
    required: true,
  },
  cutterName: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Incomplete', 'In Progress', 'Complete'],
    default: 'Incomplete',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('GrowerTask', growerTaskSchema);
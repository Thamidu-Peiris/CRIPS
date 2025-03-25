const express = require('express');
const router = express.Router();
const fuelController = require('../../controllers/TransportManager/fuelController');

// Add new fuel log
router.post('/', fuelController.addFuelLog);

// Get fuel summary per vehicle
router.get('/summary', fuelController.getFuelSummary);

// Get all fuel logs
router.get('/', fuelController.getAllFuelLogs);

module.exports = router;

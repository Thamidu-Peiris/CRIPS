const express = require('express');
const router = express.Router();
const driverController = require('../../controllers/TransportManager/driverController');
const upload = require('../../middleware/multerConfig');

// Create a new driver (with profile picture upload)
router.post('/', upload.single('profilePicture'), driverController.createDriver);

// Get all drivers
router.get('/', driverController.getAllDrivers);

// Get a single driver by ID
router.get('/:id', driverController.getDriverById);

// Update a driver (with optional profile picture update)
router.put('/:id', upload.single('profilePicture'), driverController.updateDriver);

// Delete a driver
router.delete('/:id', driverController.deleteDriver);

module.exports = router;
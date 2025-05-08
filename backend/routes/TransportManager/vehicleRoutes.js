const express = require('express');
const router = express.Router();
const vehicleController = require('../../controllers/TransportManager/vehicleController');
const multer = require('multer');

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/vehicles/' }); // Will be overridden by server.js config

// Add a new vehicle (with file upload)
router.post('/', upload.single('picture'), vehicleController.addVehicle);

// Update a vehicle (with file upload)
router.put('/:id', upload.single('picture'), vehicleController.updateVehicle);

// Delete a vehicle
router.delete('/:id', vehicleController.deleteVehicle);

// Get all vehicles
router.get('/', vehicleController.getAllVehicles);

module.exports = router;
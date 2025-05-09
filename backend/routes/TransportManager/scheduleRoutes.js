const express = require('express');
const router = express.Router();
const scheduleController = require('../../controllers/TransportManager/scheduleController');

// Create a new schedule
router.post('/', scheduleController.createSchedule);

// Get all schedules
router.get('/', scheduleController.getAllSchedules);

// Update schedule status and location
router.put('/:id/update', scheduleController.updateSchedule);

// Delete a schedule
router.delete('/:id', scheduleController.deleteSchedule);

// Get "Ready to Ship" orders (Confirmed orders)
router.get('/orders/ready', scheduleController.getReadyToShipOrders);

// Get drivers
router.get('/drivers', scheduleController.getDrivers);

module.exports = router;
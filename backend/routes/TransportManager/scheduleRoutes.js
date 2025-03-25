const express = require('express');
const router = express.Router();
const scheduleController = require('../../controllers/TransportManager/scheduleController');

router.post('/', scheduleController.createSchedule);
router.get('/', scheduleController.getAllSchedules);
router.put('/:id/status', scheduleController.updateScheduleStatus);
router.delete('/:id', scheduleController.deleteSchedule);



module.exports = router;

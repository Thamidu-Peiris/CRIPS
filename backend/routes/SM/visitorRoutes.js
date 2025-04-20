// backend\routes\SM\visitorRoutes.js
const express = require('express');
const router = express.Router();
const visitorController = require('../../controllers/SM/visitorController');

// Route to record a visit (call this from the homepage)
router.post('/record', visitorController.recordVisit);

// Route to get visitor statistics (use this in the System Manager dashboard)
router.get('/stats', visitorController.getVisitorStats);

module.exports = router;

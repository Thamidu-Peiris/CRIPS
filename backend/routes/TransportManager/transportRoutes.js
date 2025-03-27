const express = require('express');
const router = express.Router();
const routeOptimizerController = require('../../controllers/TransportManager/routeOptimizerController');

// POST /api/transport/optimize-route
router.post('/optimize-route', routeOptimizerController.optimizeRoute);

module.exports = router;
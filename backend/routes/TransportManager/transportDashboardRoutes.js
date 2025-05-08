const express = require('express');
const router = express.Router();
const Shipment = require('../../models/TransportManager/Shipment');
const Vehicle = require('../../models/TransportManager/Vehicle'); // Import Vehicle model
const Driver = require('../../models/TransportManager/drivers'); // Import Driver model

// 🚀 GET Transport Dashboard Stats (CALCULATED)
router.get('/dashboard-stats', async (req, res) => {
  try {
    // 🚚 Active Shipments count
    const activeShipments = await Shipment.countDocuments({ status: "In Transit" });

    // 🚗 Active Vehicles count
    const activeVehicles = await Vehicle.countDocuments({ status: "Active" });

    // 👥 Active Drivers count
    const activeDrivers = await Driver.countDocuments({ status: "Available" });

    res.json({
      activeShipments,
      activeVehicles,
      activeDrivers,
    });

  } catch (err) {
    console.error("Dashboard Stats Error:", err);
    res.status(500).json({ error: "Failed to fetch transport stats" });
  }
});

module.exports = router;
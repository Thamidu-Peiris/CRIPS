// backend\controllers\TransportManager\fuelController.js
const FuelLog = require('../../models/TransportManager/FuelLog');

// Add new fuel log (frontend already sends distance)
exports.addFuelLog = async (req, res) => {
  try {
    const log = await FuelLog.create(req.body);  // ✅ distance is handled here automatically
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add fuel log' });
  }
};

// ✅ Update: Include totalDistance in fuel summary
exports.getFuelSummary = async (req, res) => {
  try {
    const summary = await FuelLog.aggregate([
      {
        $group: {
          _id: "$vehicleId",
          totalLiters: { $sum: "$liters" },
          totalCost: { $sum: "$cost" },
          totalDistance: { $sum: "$distance" }  // ✅ Aggregating distance
        }
      }
    ]);
    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fuel summary' });
  }
};

// View all fuel logs
exports.getAllFuelLogs = async (req, res) => {
  try {
    const logs = await FuelLog.find().sort({ date: -1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fuel logs' });
  }
};

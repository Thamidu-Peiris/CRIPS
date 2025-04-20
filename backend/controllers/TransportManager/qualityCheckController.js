// backend\controllers\TransportManager\qualityCheckController.js
const QualityCheck = require('../../models/TransportManager/QualityCheck');

// Log a new quality check
exports.logQualityCheck = async (req, res) => {
  try {
    const log = await QualityCheck.create(req.body);
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ error: 'Failed to log quality check' });
  }
};

// Get quality check history by shipment
exports.getQualityHistory = async (req, res) => {
  try {
    const logs = await QualityCheck.find({ shipmentId: req.params.shipmentId }).sort({ checkDate: -1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quality history' });
  }
};

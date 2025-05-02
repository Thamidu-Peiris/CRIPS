// backend\controllers\TransportManager\qualityCheckController.js
const QualityCheck = require('../../models/TransportManager/QualityCheck');

// Log a new quality check
exports.logQualityCheck = async (req, res) => {
  try {
    console.log('Request body for logQualityCheck:', req.body); // Log the incoming request body
    const log = await QualityCheck.create(req.body);
    res.status(201).json(log);
  } catch (error) {
    console.error('Error in logQualityCheck:', error); // Log the full error
    res.status(500).json({ error: 'Failed to log quality check', details: error.message });
  }
};

// Get quality check history by shipment
exports.getQualityHistory = async (req, res) => {
  try {
    console.log('Fetching quality history for shipmentId:', req.params.shipmentId); // Log the shipmentId
    const logs = await QualityCheck.find({ shipmentId: req.params.shipmentId }).sort({ checkDate: -1 });
    res.status(200).json(logs);
  } catch (error) {
    console.error('Error in getQualityHistory:', error); // Log the full error
    res.status(500).json({ error: 'Failed to fetch quality history', details: error.message });
  }
};
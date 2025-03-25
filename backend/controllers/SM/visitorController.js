const Visitor = require('../../models/SM/Visitor');

// Record a visitor
exports.recordVisit = async (req, res) => {
  try {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    await Visitor.create({ visitTime: new Date(), ip });
    res.status(200).json({ message: 'Visit recorded' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to record visit' });
  }
};

// Get visitor statistics
exports.getVisitorStats = async (req, res) => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  try {
    const dayCount = await Visitor.countDocuments({ visitTime: { $gte: startOfDay } });
    const monthCount = await Visitor.countDocuments({ visitTime: { $gte: startOfMonth } });
    const yearCount = await Visitor.countDocuments({ visitTime: { $gte: startOfYear } });

    res.status(200).json({ dayCount, monthCount, yearCount });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

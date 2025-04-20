const axios = require('axios');

// Dummy function to simulate distance calculation between two cities
function calculateDistance(a, b) {
  // Replace this with real API if needed
  return Math.abs(a.charCodeAt(0) - b.charCodeAt(0));
}

// Naive nearest-neighbor optimization
exports.optimizeRoute = async (req, res) => {
  try {
    const { locations } = req.body;

    if (!Array.isArray(locations) || locations.length < 2) {
      return res.status(400).json({ error: 'At least two delivery locations are required.' });
    }

    let remaining = [...locations];
    const route = [];

    // Start from the first location
    let current = remaining.shift();
    route.push(current);

    while (remaining.length > 0) {
      remaining.sort((a, b) => calculateDistance(current, a) - calculateDistance(current, b));
      current = remaining.shift();
      route.push(current);
    }

    res.json({ optimized: route });
  } catch (error) {
    console.error('Error optimizing route:', error);
    res.status(500).json({ error: 'Failed to optimize route.' });
  }
};

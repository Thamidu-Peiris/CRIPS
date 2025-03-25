const express = require('express');
const router = express.Router();
const EnvironmentalData = require('../../models/GrowerHandler/EnvironmentalData');

// POST route to add new environmental data
router.post('/', async (req, res) => {
  try {
    const { plantName, category, temperature, humidity, lightLevel, soilMoisture, timestamp } = req.body;

    // Validate required fields
    if (!plantName || !category || temperature === undefined || humidity === undefined || lightLevel === undefined || soilMoisture === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create new environmental data entry
    const newData = new EnvironmentalData({
      plantName,
      category,
      temperature,
      humidity,
      lightLevel,
      soilMoisture,
      timestamp: timestamp || Date.now(),
    });

    // Save to database
    await newData.save();

    res.status(201).json({ message: "Environmental data added successfully", data: newData });
  } catch (error) {
    console.error("Error adding environmental data:", error);
    res.status(500).json({ message: "Server error while adding environmental data", error: error.message });
  }
});

// GET route to fetch all environmental data
router.get('/', async (req, res) => {
  try {
    const { plantName, category, startTime, endTime } = req.query;

    // Build query object
    const query = {};
    if (plantName) query.plantName = plantName;
    if (category) query.category = category;
    if (startTime && endTime) {
      query.timestamp = {
        $gte: new Date(startTime),
        $lte: new Date(endTime),
      };
    }

    const data = await EnvironmentalData.find(query).sort({ timestamp: -1 }); // Sort by timestamp (newest first)
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching environmental data:", error);
    res.status(500).json({ message: "Server error while fetching environmental data", error: error.message });
  }
});

module.exports = router;
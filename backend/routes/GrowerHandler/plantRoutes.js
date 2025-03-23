//
const express = require('express');
const router = express.Router();
const Plant = require('../../models/GrowerHandler/Plant');

console.log('Setting up plant routes...'); // Add this to confirm the file is loaded

// POST route to add a new plant
router.post('/', async (req, res) => {
  console.log('Received POST request to /api/plants');
  try {
    const {
      plantName,
      scientificName,
      speciesCategory,
      lightRequirement,
      waterTemperatureMin,
      waterTemperatureMax,
      pHMin,
      pHMax,
      co2Requirement,
      fertilizerRequirement,
      stockQuantity,
      pricePerUnit,
      supplierName,
      plantImage,
      description,
      plantBatchStatus,
      plantAvailability,
    } = req.body;

    if (
      !plantName ||
      !scientificName ||
      !speciesCategory ||
      !lightRequirement ||
      !waterTemperatureMin ||
      !waterTemperatureMax ||
      !pHMin ||
      !pHMax ||
      !stockQuantity ||
      !pricePerUnit ||
      !supplierName
    ) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const newPlant = new Plant({
      plantName,
      scientificName,
      speciesCategory,
      lightRequirement,
      waterTemperatureMin,
      waterTemperatureMax,
      pHMin,
      pHMax,
      co2Requirement,
      fertilizerRequirement,
      stockQuantity,
      pricePerUnit,
      supplierName,
      plantImage,
      description,
      plantBatchStatus,
      plantAvailability,
    });

    await newPlant.save();

    res.status(201).json({ message: 'Plant added successfully', plant: newPlant });
  } catch (error) {
    console.error('Error adding plant:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET route to fetch all plants
router.get('/', async (req, res) => {
  console.log('Received GET request to /api/plants'); // Add this to confirm the route is hit
  try {
    const plants = await Plant.find();
    res.status(200).json(plants);
  } catch (error) {
    console.error('Error fetching plants:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT route to update a plant
router.put('/:id', async (req, res) => {
  console.log(`Received PUT request to /api/plants/${req.params.id}`);
  try {
    const {
      plantName,
      scientificName,
      speciesCategory,
      lightRequirement,
      waterTemperatureMin,
      waterTemperatureMax,
      pHMin,
      pHMax,
      co2Requirement,
      fertilizerRequirement,
      stockQuantity,
      pricePerUnit,
      supplierName,
      plantImage,
      description,
      plantBatchStatus,
      plantAvailability,
    } = req.body;

    const plant = await Plant.findById(req.params.id);

    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    // Update all fields
    plant.plantName = plantName || plant.plantName;
    plant.scientificName = scientificName || plant.scientificName;
    plant.speciesCategory = speciesCategory || plant.speciesCategory;
    plant.lightRequirement = lightRequirement || plant.lightRequirement;
    plant.waterTemperatureMin = waterTemperatureMin || plant.waterTemperatureMin;
    plant.waterTemperatureMax = waterTemperatureMax || plant.waterTemperatureMax;
    plant.pHMin = pHMin || plant.pHMin;
    plant.pHMax = pHMax || plant.pHMax;
    plant.co2Requirement = co2Requirement || plant.co2Requirement;
    plant.fertilizerRequirement = fertilizerRequirement || plant.fertilizerRequirement;
    plant.stockQuantity = stockQuantity || plant.stockQuantity;
    plant.pricePerUnit = pricePerUnit || plant.pricePerUnit;
    plant.supplierName = supplierName || plant.supplierName;
    plant.plantImage = plantImage || plant.plantImage;
    plant.description = description || plant.description;
    plant.plantBatchStatus = plantBatchStatus || plant.plantBatchStatus;
    plant.plantAvailability = plantAvailability || plant.plantAvailability;

    await plant.save();
    res.status(200).json(plant);
  } catch (error) {
    console.error('Error updating plant:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE route to delete a plant
router.delete('/:id', async (req, res) => {
  console.log(`Received DELETE request to /api/plants/${req.params.id}`);
  try {
    const plant = await Plant.findById(req.params.id);

    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    await Plant.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Plant deleted successfully' });
  } catch (error) {
    console.error('Error deleting plant:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
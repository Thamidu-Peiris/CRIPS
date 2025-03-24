//CRIPS\backend\routes\customer\plantRoutes.js
const express = require("express");
const router = express.Router();
const { getPlants, getPlantById, getPlantReviews, addPlant, deletePlant } = require("../../controllers/GrowerHandler/plantController");

// Plant Routes
//router.get("/", getPlants);
//router.get("/:id", getPlantById);
//router.get("/:id/reviews", getPlantReviews);
router.post("/", addPlant);
//router.delete("/:id", deletePlant);

module.exports = router;
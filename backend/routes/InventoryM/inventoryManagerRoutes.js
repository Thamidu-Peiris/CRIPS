const express = require("express");
const router = express.Router();
const inventoryManagerController = require("../../controllers/InventoryManager/inventoryManagerController");

// Inventory Manager Routes
router.get("/profile/:id", inventoryManagerController.getProfileById);
router.put("/profile/update/:id", inventoryManagerController.updateProfile);
router.post("/profile/change-password/:id", inventoryManagerController.changePassword);
router.post("/apply", inventoryManagerController.applyForJob);
router.post("/login", inventoryManagerController.login);

module.exports = router;
// CRIPS\backend\routes\growerHandler\plantRoutes.js
const express = require("express");
const router = express.Router();
const { addPlant, addCategory, getCategories, editCategory, deleteCategory } = require("../../controllers/growerHandler/plantController");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    if (decoded.role !== "grower handler") {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

router.post("/plants", authMiddleware, addPlant);
router.post("/categories", authMiddleware, addCategory);
router.get("/categories", authMiddleware, getCategories);
router.put("/categories/:id", authMiddleware, editCategory);
router.delete("/categories/:id", authMiddleware, deleteCategory);

module.exports = router;
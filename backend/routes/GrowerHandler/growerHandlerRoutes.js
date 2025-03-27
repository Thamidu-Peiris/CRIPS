// backend/routes/GrowerHandler/growerHandlerRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path'); // Add this import
const growerHandlerController = require('../../controllers/GrowerHandler/growerHandlerController');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use path here
  },
});
const upload = multer({ storage });

// Routes
router.get('/profile/:id', growerHandlerController.getProfile);
router.put('/profile/update/:id', upload.single('profileImage'), growerHandlerController.updateProfile);
router.post('/change-password/:id', growerHandlerController.changePassword);

module.exports = router;
// CRIPS\backend\routes\SM\smRoute.js
const express = require('express');
const { 
  loginSystemManager, 
  registerSystemManager 
} = require('../../controllers/SM/smController');
const { 
  getProfile, 
  updateProfile 
} = require('../../controllers/SM/smProfileController');

const router = express.Router();

// ✅ Register a new system manager
router.post('/register', registerSystemManager);

// ✅ Get system manager profile
router.get('/profile', getProfile);

// ✅ Update system manager profile
router.put('/profile', updateProfile);

module.exports = router; // ✅ CommonJS export

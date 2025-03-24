//CRIPS\backend\routes\customer\userRoutes.js
const express = require('express');
const router = express.Router();
const { createUser, loginUser, updateUserProfile, changePassword, deleteUser, upload } = require('../../controllers/customer/userController');

// Use upload directly as middleware
router.post('/register', upload, createUser);
router.post('/login', loginUser);
router.put('/profile', upload, updateUserProfile);
router.put('/change-password', changePassword);
router.delete('/delete', deleteUser);

module.exports = router;
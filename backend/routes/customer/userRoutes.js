//CRIPS\backend\routes\customer\userRoutes.js
const express = require('express');
const router = express.Router();
const { createUser, loginUser, updateUserProfile, changePassword, deleteUser, upload } = require('../../controllers/customer/userController'); // Added deleteUser

router.post('/register', upload.single('profileImage'), createUser);
router.post('/login', loginUser);
router.put('/profile', upload.single('profileImage'), updateUserProfile);
router.put('/change-password', changePassword);
router.delete('/delete', deleteUser); 

module.exports = router;
const express = require('express');
const router = express.Router();
const { createUser, loginUser } = require('../controllers/userController');

// Customer Registration Route
router.post('/register', createUser); 

// Customer Login Route
router.post('/login', loginUser); 

module.exports = router;

const express = require('express');
const { universalLogin } = require('../controllers/authController');
const router = express.Router();

router.post('/login', universalLogin);

module.exports = router;

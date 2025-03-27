const express = require('express');
const { sendStatusNotification } = require('../../controllers/SM/emailController');
const router = express.Router();

router.post('/send-status-notification', sendStatusNotification);

module.exports = router;

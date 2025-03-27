const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {
  getProfile,
  updateProfile,
} = require('../../controllers/TransportManager/tmProfileController');
const authMiddleware = require('../../middleware/auth');

router.get('/profile', authMiddleware, getProfile);

router.put('/profile', authMiddleware, updateProfile);

router.get('/generate-token/:id', (req, res) => {
  const token = jwt.sign({ id: req.params.id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;
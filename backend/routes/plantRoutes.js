const express = require('express');
const router = express.Router();

// Example plant data (replace this with a real database call)
const plants = [
  { id: 1, name: 'Tropical Plant', price: 25, image: '/plant1.jpg' },
  { id: 2, name: 'Succulent', price: 15, image: '/plant2.jpg' },
  { id: 3, name: 'Air Purifier', price: 20, image: '/plant3.jpg' },
  { id: 4, name: 'Flowering Plant', price: 18, image: '/plant4.jpg' }
];

// GET /api/plants
router.get('/', (req, res) => {
  res.json(plants);
});

module.exports = router;

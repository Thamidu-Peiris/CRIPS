const express = require('express');
const router = express.Router();
const vacancyController = require('../../controllers/SM/vacancyController');
const authMiddleware = require('../../middleware/auth'); // Import as default
const isSystemManager = require('../../middleware/isSystemManager'); // Import from separate file

// Public route: Get all vacancies (for Careers page)
router.get('/', vacancyController.getAllVacancies);

// Protected routes: Only System Manager can add, update, or delete vacancies
router.post('/', authMiddleware, isSystemManager, vacancyController.addVacancy);
router.put('/:id', authMiddleware, isSystemManager, vacancyController.updateVacancy);
router.delete('/:id', authMiddleware, isSystemManager, vacancyController.deleteVacancy);

module.exports = router;
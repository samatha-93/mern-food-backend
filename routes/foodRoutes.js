// backend/routes/foodRoutes.js
const router = require('express').Router();
const { getFoods, addFood, getFoodById } = require('../controllers/foodController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getFoods);
router.get('/:id', getFoodById);
router.post('/', protect, addFood); // protect addFood (admin)
module.exports = router;

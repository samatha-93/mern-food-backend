// backend/routes/foodRoutes.js
const router = require('express').Router();
const { getFoods, addFood, getFoodById } = require('../controllers/foodController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getFoods);
router.get('/:id', getFoodById);
router.post('/', protect, addFood); // protect addFood (admin)
module.exports = router;
// @route   POST /api/foods/:id/reviews
// @desc    Add a review to food
// @access  Private
router.post("/:id/reviews", authMiddleware, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const food = await Food.findById(req.params.id);

    if (!food) return res.status(404).json({ msg: "Food not found" });

    const review = {
      user: req.user.id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    food.reviews.push(review);
    await food.save();

    res.json({ msg: "Review added successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// @route   GET /api/foods/:id/reviews
// @desc    Get all reviews for a food
// @access  Public
router.get("/:id/reviews", async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).populate("reviews.user", "name");
    if (!food) return res.status(404).json({ msg: "Food not found" });
    res.json(food.reviews);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

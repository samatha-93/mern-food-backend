// backend/routes/foodRoutes.js
const router = require("express").Router();
const {
  getFoods,
  addFood,
  getFoodById,
} = require("../controllers/foodController");
const { protect } = require("../middleware/authMiddleware");
const Food = require("../models/Food");

// @route   GET /api/foods
router.get("/", getFoods);

// @route   GET /api/foods/:id
router.get("/:id", getFoodById);

// @route   POST /api/foods
// @desc    Add new food (admin only)
// @access  Private
router.post("/", protect, addFood);

// @route   POST /api/foods/:id/reviews
// @desc    Add a review to food
// @access  Private
router.post("/:id/reviews", protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const food = await Food.findById(req.params.id);

    if (!food) return res.status(404).json({ msg: "Food not found" });

    const review = {
      user: req.user.id,
      rating: Number(rating),
      comment,
    };

    food.reviews.push(review);
    await food.save();

    res.json({ msg: "Review added successfully" });
  } catch (err) {
    console.error("Review error:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// @route   GET /api/foods/:id/reviews
// @desc    Get all reviews for a food
// @access  Public
router.get("/:id/reviews", async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).populate(
      "reviews.user",
      "name"
    );

    if (!food) return res.status(404).json({ msg: "Food not found" });

    res.json(food.reviews);
  } catch (err) {
    console.error("Get reviews error:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;

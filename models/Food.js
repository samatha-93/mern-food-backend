const mongoose = require("mongoose");

// Review schema for food
const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  createdAt: { type: Date, default: Date.now }
});

// Food schema
const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  hotel: String,
  imageUrl: String,
  reviews: [reviewSchema]
});

module.exports = mongoose.model("Food", foodSchema);

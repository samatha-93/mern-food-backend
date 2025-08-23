// backend/models/Food.js
const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
  hotel: { type: String },
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  imageUrl: String,
  category: String,
  available: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Food', FoodSchema);

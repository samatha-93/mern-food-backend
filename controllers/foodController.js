// backend/controllers/foodController.js
const Food = require('../models/Food');

exports.getFoods = async (req, res) => {
  const foods = await Food.find();
  res.json(foods);
};

exports.addFood = async (req, res) => {
  const food = await Food.create(req.body);
  res.json(food);
};

exports.getFoodById = async (req, res) => {
  const food = await Food.findById(req.params.id);
  if(!food) return res.status(404).json({ message: 'Not found' });
  res.json(food);
};

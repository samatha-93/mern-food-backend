// backend/seed.js
require('dotenv').config();
const connectDB = require('./config/db');
const Food = require('./models/Food');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const seed = async () => {
  await connectDB();
  // remove all
  await Food.deleteMany({});
  await User.deleteMany({});

  const foods = [
    { hotel: 'Hotel A', name: 'Paneer Butter Masala', description: 'Creamy', price: 180, imageUrl: '', category: 'Veg' },
    { hotel: 'Hotel B', name: 'Chicken Biryani', description: 'Spicy', price: 220, imageUrl: '', category: 'Non-Veg' },
    { hotel: 'Hotel C', name: 'Veg Thali', description: 'Mixed', price: 150, imageUrl: '', category: 'Veg' }
  ];

  await Food.insertMany(foods);
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash('test1234', salt);
  await User.create({ name: 'Test User', email: 'test@example.com', password: hashed });
  console.log('Seed done');
  process.exit();
};

seed().catch(err => {
  console.error(err);
  process.exit(1);
});


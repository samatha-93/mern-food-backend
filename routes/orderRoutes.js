// backend/routes/orderRoutes.js
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Food = require('../models/Food');
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware');

// ✅ GET all orders for logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ GET /myorders (specific user orders)
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: new mongoose.Types.ObjectId(req.user.id) });
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

// ✅ POST /place (with full order details)
router.post('/place', protect, async (req, res) => {
  try {
    const { items, total, extraAmount, coupon, deliveryAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ msg: 'No items in order' });
    }

    const processedItems = await Promise.all(items.map(async (i) => {
      const foodDoc = await Food.findById(i.food);
      if (!foodDoc) throw new Error('Food not found: ' + i.food);
      return {
        food: foodDoc._id,
        name: foodDoc.name,
        qty: i.qty,
        price: i.price
      };
    }));

    const order = new Order({
      user: req.user.id,
      items: processedItems,
      total: total + (extraAmount || 0),
      extraAmount: extraAmount || 0,
      coupon: coupon || null,
      deliveryAddress: deliveryAddress || '',
      paymentMethod: paymentMethod || 'COD',
      status: 'pending'
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

// ✅ PUT /cancel/:id → Cancel order
router.put('/cancel/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ msg: 'Order not found' });

    order.status = 'canceled';
    await order.save();

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

// ✅ PUT /deliver/:id → Mark as delivered
router.put('/deliver/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ msg: 'Order not found' });

    order.status = 'delivered';
    await order.save();

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

module.exports = router;

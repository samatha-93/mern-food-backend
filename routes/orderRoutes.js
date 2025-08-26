const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Food = require('../models/Food');
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware');

// GET all orders for logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: new mongoose.Types.ObjectId(req.user.id) });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /place (place order with validation)
router.post('/place', protect, async (req, res) => {
  try {
    const { items, total, coupon, paymentMethod, deliveryAddress } = req.body;

    if (!items || items.length === 0) return res.status(400).json({ msg: 'No items in order' });
    if (!paymentMethod) return res.status(400).json({ msg: 'Payment method is required' });
    if (!deliveryAddress) return res.status(400).json({ msg: 'Delivery address is required' });

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
      total,
      coupon,
      paymentMethod,
      deliveryAddress
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});
// Cancel an order (user only)
router.patch("/:id/cancel", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ msg: "Order not found" });

    // Only the user who placed the order can cancel
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized to cancel this order" });
    }

    // Update status
    order.status = "canceled";
    await order.save();

    res.json({ msg: "Order canceled successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});


module.exports = router;

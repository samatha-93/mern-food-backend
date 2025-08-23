// backend/controllers/orderController.js
const Order = require('../models/Order');
const Food = require('../models/Food');

exports.placeOrder = async (req, res) => {
  try {
    const { items, total, coupon } = req.body;
    if(!items || items.length === 0) return res.status(400).json({ message: 'Cart empty' });
    // Optional: validate each food exists
    const orderItems = await Promise.all(items.map(async it => {
      const food = await Food.findById(it.food);
      return { food: it.food, name: food?.name || it.name, qty: it.qty, price: it.price };
    }));
    const order = await Order.create({ user: req.user._id, items: orderItems, total, coupon });
    // placeholder for notification (console)
    console.log(`Order placed: ${order._id} by ${req.user.email}`);
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if(!order) return res.status(404).json({ message: 'Order not found' });
    if(String(order.user) !== String(req.user._id)) return res.status(403).json({ message: 'Not allowed' });
    order.status = 'canceled';
    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.getUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('items.food');
  res.json(orders);
};

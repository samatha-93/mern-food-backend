const mongoose = require('mongoose');

// Each item in the order
const OrderItemSchema = new mongoose.Schema({
  food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
  name: String,
  qty: Number,
  price: Number
});

// Order schema
const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [OrderItemSchema],
  total: { type: Number, required: true },
  extraAmount: { type: Number, default: 0 },       // for extra charges
  coupon: { type: String, default: null },         // coupon code
  deliveryAddress: { type: String, required: true },
  paymentMethod: { type: String, enum: ['COD','UPI','Card'], default: 'COD' },
  status: { type: String, enum: ['pending','placed','canceled','preparing','completed','delivered'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);

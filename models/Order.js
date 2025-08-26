const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        food: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true },
    coupon: { type: String },
    paymentMethod: {
      type: String,
      enum: ["cash", "card"], // lowercase
      required: true,
    },
    deliveryAddress: { type: String, required: true },
    status: {
      type: String,
      enum: ["placed", "preparing", "out for delivery", "delivered", "canceled"],
      default: "placed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);

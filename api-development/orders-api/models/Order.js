const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, default: uuidv4, unique: true }, // auto-generated identifier
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }],
  totalAmount: { type: Number, required: true, min: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);

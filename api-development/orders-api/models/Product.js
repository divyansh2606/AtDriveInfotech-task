const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: String,
  price: { type: Number, required: true, min: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);

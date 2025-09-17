const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');

// Seed sample user + products
router.post('/', async (req, res, next) => {
  try {
    await User.deleteMany({});
    await Product.deleteMany({});

    const user = await User.create({ name: "Alice", email: "alice@example.com" });
    const products = await Product.insertMany([
      { name: "Pump A", price: 50 },
      { name: "Motor B", price: 25 }
    ]);

    res.json({ user, products });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

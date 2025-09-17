const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

/**
 * Create an order
 * POST /api/orders
 */
exports.createOrder = async (req, res, next) => {
  try {
    const { userId, productIds, totalAmount } = req.body;

    // 1) check user exists
    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ errors: [{ msg: 'User not found' }] });

    // 2) check products exist
    const products = await Product.find({ _id: { $in: productIds } });
    if (products.length !== productIds.length) {
      return res.status(400).json({ errors: [{ msg: 'One or more products not found' }] });
    }

    // 3) optional: validate totalAmount equals sum(product.price)
    const computedTotal = products.reduce((sum, p) => sum + (p.price || 0), 0);
    if (Math.abs(computedTotal - totalAmount) > 1e-6) {
      // fail validation to ensure integrity — remove this check if you prefer not to enforce it
      return res.status(400).json({ errors: [{ msg: `totalAmount mismatch — expected ${computedTotal}` }] });
    }

    // 4) create order
    const order = new Order({ userId, productIds, totalAmount });
    await order.save();

    // populate for response
    await order.populate('userId', 'name email').populate('productIds', 'name price');

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

/**
 * Retrieve an order by orderId
 * GET /api/orders/:orderId
 */
exports.getOrderByOrderId = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId })
      .populate('userId', 'name email')
      .populate('productIds', 'name price');

    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

/**
 * Update an order (partial updates allowed)
 * PUT /api/orders/:orderId
 */
exports.updateOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const updates = req.body;

    const order = await Order.findOne({ orderId });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // If userId is being updated -> validate
    if (updates.userId) {
      const user = await User.findById(updates.userId);
      if (!user) return res.status(400).json({ errors: [{ msg: 'User not found' }] });
      order.userId = updates.userId;
    }

    // If productIds updated -> validate products
    if (updates.productIds) {
      const products = await Product.find({ _id: { $in: updates.productIds } });
      if (products.length !== updates.productIds.length) {
        return res.status(400).json({ errors: [{ msg: 'One or more products not found' }] });
      }
      order.productIds = updates.productIds;

      // if totalAmount is not provided, recompute or ensure it's valid below
    }

    // If totalAmount updated -> set
    if (updates.totalAmount !== undefined) {
      order.totalAmount = updates.totalAmount;
    }

    // If productIds changed but totalAmount not provided -> recompute and set
    if (updates.productIds && updates.totalAmount === undefined) {
      const products = await Product.find({ _id: { $in: updates.productIds } });
      const computedTotal = products.reduce((sum, p) => sum + (p.price || 0), 0);
      order.totalAmount = computedTotal;
    }

    await order.save();
    await order.populate('userId', 'name email').populate('productIds', 'name price');

    res.json(order);
  } catch (err) {
    next(err);
  }
};

/**
 * Delete an order
 * DELETE /api/orders/:orderId
 */
exports.deleteOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const deleted = await Order.findOneAndDelete({ orderId });
    if (!deleted) return res.status(404).json({ message: 'Order not found' });
    // 204 would return empty body; here we return 200 with a message
    res.status(200).json({ message: 'Order deleted', orderId: deleted.orderId });
  } catch (err) {
    next(err);
  }
};

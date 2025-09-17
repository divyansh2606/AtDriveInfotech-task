const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { createOrderValidators, updateOrderValidators } = require('../validation/orderValidation');

// Create an order
router.post('/', createOrderValidators, orderController.createOrder);

// Retrieve an order by orderId
router.get('/:orderId', orderController.getOrderByOrderId);

// Update an order (partial updates allowed)
router.put('/:orderId', updateOrderValidators, orderController.updateOrder);

// Delete an order
router.delete('/:orderId', orderController.deleteOrder);

module.exports = router;

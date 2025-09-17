const { check, validationResult } = require('express-validator');

const createOrderValidators = [
  check('userId').notEmpty().withMessage('userId is required').isMongoId().withMessage('userId must be a valid Mongo id'),
  check('productIds').isArray({ min: 1 }).withMessage('productIds must be an array with at least one id'),
  check('productIds.*').isMongoId().withMessage('each productId must be a valid Mongo id'),
  check('totalAmount').isFloat({ gt: 0 }).withMessage('totalAmount must be a positive number'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];

// For updates we allow partial updates (fields optional)
const updateOrderValidators = [
  check('userId').optional().isMongoId().withMessage('userId must be a valid Mongo id'),
  check('productIds').optional().isArray().withMessage('productIds must be an array'),
  check('productIds.*').optional().isMongoId().withMessage('each productId must be a valid Mongo id'),
  check('totalAmount').optional().isFloat({ gt: 0 }).withMessage('totalAmount must be a positive number'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];

module.exports = {
  createOrderValidators,
  updateOrderValidators
};

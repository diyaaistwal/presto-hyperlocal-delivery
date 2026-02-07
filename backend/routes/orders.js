const express = require('express');
const router = express.Router();
const store = require('../store');

// POST /orders - Create a new order
router.post('/', (req, res) => {
  const { request } = req.body;
  const newOrder = {
    id: 'ord_' + Math.random().toString(36).substr(2, 9),
    request,
    status: 'searching',
    createdAt: new Date().toISOString()
  };
  store.orders.push(newOrder);
  res.status(201).json(newOrder);
});

// GET /orders - Get all orders
router.get('/', (req, res) => {
  res.json(store.orders);
});

module.exports = router;
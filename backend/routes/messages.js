const express = require('express');
const router = express.Router();
const store = require('../store');

// POST /messages - Send a message
router.post('/', (req, res) => {
  const { orderId, sender, text } = req.body;
  const newMessage = {
    id: 'msg_' + Math.random().toString(36).substr(2, 9),
    orderId,
    sender,
    text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
  store.messages.push(newMessage);
  res.status(201).json(newMessage);
});

// GET /messages/:orderId - Get messages for a specific order
router.get('/:orderId', (req, res) => {
  const { orderId } = req.params;
  const orderMessages = store.messages.filter(m => m.orderId === orderId);
  res.json(orderMessages);
});

module.exports = router;
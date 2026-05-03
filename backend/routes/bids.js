const express = require('express');
const router = express.Router();

// GET /bids/:orderId - Get mock bids for an order
router.get('/:orderId', (req, res) => {
  const { orderId } = req.params;

  if (!orderId) {
    return res.status(400).json({ message: 'Order ID is required' });
  }

  const mockPartners = [
    {
      id: 'p1',
      name: 'Amit Kumar',
      fee: Math.floor(Math.random() * 50) + 20,
      rating: 4.9,
      eta: `${Math.floor(Math.random() * 10) + 10} mins`
    },
    {
      id: 'p2',
      name: 'Suresh Raina',
      fee: Math.floor(Math.random() * 50) + 20,
      rating: 4.7,
      eta: `${Math.floor(Math.random() * 10) + 15} mins`
    },
    {
      id: 'p3',
      name: 'Rohan Mehra',
      fee: Math.floor(Math.random() * 50) + 20,
      rating: 4.5,
      eta: `${Math.floor(Math.random() * 10) + 20} mins`
    }
  ];

  mockPartners.sort((a, b) => a.fee - b.fee);

  res.json({
    orderId,
    totalBids: mockPartners.length,
    bids: mockPartners
  });
});

module.exports = router;

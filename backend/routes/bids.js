const express = require('express');
const router = express.Router();

// GET /bids/:orderId - Get mock bids for an order
router.get('/:orderId', (req, res) => {
  const mockPartners = [
    {
      id: 'p1',
      name: 'Amit Kumar',
      fee: 45,
      rating: 4.9,
      eta: '12 mins'
    },
    {
      id: 'p2',
      name: 'Suresh Raina',
      fee: 30,
      rating: 4.7,
      eta: '18 mins'
    },
    {
      id: 'p3',
      name: 'Rohan Mehra',
      fee: 25,
      rating: 4.5,
      eta: '22 mins'
    }
  ];
  res.json(mockPartners);
});

module.exports = router;
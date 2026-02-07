const express = require('express');
const cors = require('cors');
const ordersRouter = require('./routes/orders');
const messagesRouter = require('./routes/messages');
const bidsRouter = require('./routes/bids');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.send('Prestó Backend Running');
});

// Route mounting
app.use('/orders', ordersRouter);
app.use('/messages', messagesRouter);
app.use('/bids', bidsRouter);

app.listen(PORT, () => {
  console.log(`Prestó Backend listening on port ${PORT}`);
});
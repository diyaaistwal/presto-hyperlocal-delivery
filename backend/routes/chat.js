const express = require('express');
const router = express.Router();

// POST /chat
router.post('/', async (req, res) => {
  const { message, partner } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  // Temporary smart reply logic
  let reply = "I'm on it 👍";

  if (message.toLowerCase().includes("price")) {
    reply = "Let me check the price for you.";
  }

  if (message.toLowerCase().includes("add")) {
    reply = "Sure, tell me what item you'd like to add.";
  }

  if (message.toLowerCase().includes("confirm")) {
    reply = "Here is your order summary. Total will be ₹250.";
  }

  res.json({ reply });
});

module.exports = router;

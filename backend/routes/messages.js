const express = require("express");
const router = express.Router();
const Message = require("../models/Message");


// 🟩 POST /messages → Send a message
router.post("/", async (req, res) => {
  try {
    const { orderId, sender, text } = req.body;

    const message = await Message.create({
      orderId,
      sender,
      text
    });

    res.status(201).json(message);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🟩 GET /messages/:orderId → Get messages for an order
router.get("/:orderId", async (req, res) => {
  try {
    const messages = await Message.find({
      orderId: req.params.orderId
    });

    res.json(messages);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;

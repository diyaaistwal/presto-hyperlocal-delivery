const express = require('express');
const router = express.Router();

// POST /chat
router.post('/', async (req, res) => {
  console.log("🔥 /chat endpoint hit");
  console.log("Request Body:", req.body);

  try {
    const { message, partner } = req.body;

    // Validation
    if (!message || typeof message !== "string") {
      return res.status(400).json({ reply: "Message is required." });
    }

    const userMessage = message.toLowerCase();

    // Smart temporary logic (MVP mode)
    let reply = `Got it 👍 I'm checking that for you.`;

    if (userMessage.includes("price")) {
      reply = "Let me quickly check the price for you.";
    }

    else if (userMessage.includes("add")) {
      reply = "Sure! Tell me which item you'd like to add.";
    }

    else if (userMessage.includes("confirm")) {
      reply = "Here is your order summary. Total will be ₹250.";
    }

    else if (userMessage.includes("hello") || userMessage.includes("hi")) {
      reply = `Hi! I'm ${partner || "your rider"}. What can I get for you today?`;
    }

    console.log("Reply Sent:", reply);

    return res.json({ reply });

  } catch (error) {
    console.error("❌ Chat Route Error:", error);
    return res.status(500).json({
      reply: "Server error. Please try again."
    });
  }
});

module.exports = router;

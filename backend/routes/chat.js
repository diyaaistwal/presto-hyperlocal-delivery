const express = require("express");
const router = express.Router();

// POST /chat
router.post("/", async (req, res) => {
  try {
    const { message, partner } = req.body;

    // 🔴 Validation
    if (!message || typeof message !== "string") {
      return res.status(400).json({ reply: "Message is required." });
    }

    const userMessage = message.toLowerCase();

    let reply = "Got it 👍 I'm checking that for you.";

    // 🧠 Basic intent logic
    if (userMessage.includes("price")) {
      reply = "Let me check the price for you.";
    } 
    
    else if (userMessage.includes("add")) {
      reply = "Sure! What item would you like to add?";
    } 
    
    else if (userMessage.includes("confirm")) {
      reply = "Your order is confirmed. Total is ₹250.";
    } 
    
    else if (userMessage.includes("hello") || userMessage.includes("hi")) {
      reply = `Hi! I'm ${partner || "your delivery partner"}. What can I get for you today?`;
    }

    // 🟢 Response
    return res.json({
      success: true,
      reply
    });

  } catch (error) {
    console.error("Chat error:", error);

    return res.status(500).json({
      success: false,
      reply: "Server error. Please try again."
    });
  }
});

module.exports = router;

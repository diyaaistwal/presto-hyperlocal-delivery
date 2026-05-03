const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },

  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  senderType: {
    type: String,
    enum: ["user", "partner"],
    required: true
  },

  text: {
    type: String,
    required: true
  },

  type: {
    type: String,
    enum: ["text", "image", "location"],
    default: "text"
  },

  isRead: {
    type: Boolean,
    default: false
  },

  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Message", messageSchema);

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  userRequest: {
    type: String,
    required: true
  },

  pickupLocation: String,
  dropLocation: String,

  status: {
    type: String,
    enum: ["pending", "bidding", "accepted", "in_progress", "completed", "cancelled"],
    default: "pending"
  },

  bids: [
    {
      partnerId: String,
      fee: Number,
      eta: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],

  assignedPartner: {
    type: String,
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", orderSchema);

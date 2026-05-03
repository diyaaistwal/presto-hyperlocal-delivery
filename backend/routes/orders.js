const express = require("express");
const router = express.Router();
const Order = require("../models/Order");


// 🟩 POST /orders → Create order
router.post("/", async (req, res) => {
  try {
    const { userRequest } = req.body;

    const order = await Order.create({
      userRequest,
      status: "pending"
    });

    res.status(201).json(order);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🟩 GET /orders → Get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🟩 GET /orders/:id → Get single order
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    res.json(order);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;

const express = require("express");
const Order = require("../modals/orderModal");

const app = express.Router();

app.post("/createOrder", async (req, res) => {
  try {
    const { items, totalPrice } = req.body;
    const newOrder = new Order({
      items,
      totalPrice,
    });

    await newOrder.save();
    res
      .status(201)
      .json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.get("/getOrder", async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = app;

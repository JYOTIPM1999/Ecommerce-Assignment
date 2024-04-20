const express = require("express");
const Cart = require("../modals/cartModal");

const app = express.Router();

app.post("/addToCart", async (req, res) => {
  const { productId } = req.body;

  try {
    let cartItem = await Cart.findOne({ productId });

    if (cartItem) {
      // If the product is already in the cart, update its quantity
      cartItem.quantity += 1;
      await cartItem.save();
    } else {
      // If the product is not in the cart, create a new cart item
      cartItem = new Cart({ productId });
      await cartItem.save();
    }

    res.send("Product added to cart");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/getCartItems", async (req, res) => {
  try {
    const cartItems = await Cart.find().populate("productId");
    res.send(cartItems);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.put("/updateQuantity/:itemId", async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  try {
    let cartItem = await Cart.findById(itemId);

    if (!cartItem) {
      return res.status(404).send("Item not found in cart");
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    const updatedCartItems = await Cart.find().populate("productId");
    res.send(updatedCartItems);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.delete("/clearCart", async (req, res) => {
  try {
    await Cart.deleteMany();
    res.send("Cart items cleared successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = app;

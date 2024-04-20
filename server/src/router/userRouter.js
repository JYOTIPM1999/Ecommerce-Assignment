const express = require("express");

const User = require("../modals/userModal");
const app = express.Router();

app.post("/signup", async (req, res) => {
  let { email, password, name } = req.body;
  console.log(email, name, password);

  try {
    let isAvailable = await User.findOne({ email });
    if (isAvailable) {
      res.status(404).send("User already exists");
    }

    let newUser = await User.create(req.body);
    res.send({
      token: `${newUser.id}+${newUser.email}+${newUser.password}`,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/login", async (req, res) => {
  let { email, password } = req.body;

  try {
    let user = await User.findOne({ email, password });
    if (!user) {
      res.status(404).send("Authentication failed");
    }
    res.send({
      token: `${user.id}+${user.email}+${user.password}`,
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

module.exports = app;

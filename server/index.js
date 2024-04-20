const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./src/router/userRouter");
const productRoutes = require("./src/router/productRouter");
const cartRoutes = require("./src/router/cartRouter");
const orderRoutes = require("./src/router/orderRouter");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(
  cors({
    origin: "http://localhost:8081", // Allow your frontend domain
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Allow cookies to be sent
  })
);

const mongoDBURI =
  "mongodb+srv://jyotipm1999:jyotipm1999@assessment.r6xniqw.mongodb.net/?retryWrites=true&w=majority&appName=assessment";

mongoose
  .connect(mongoDBURI)
  .then(() => {
    console.log("MongoDb connected");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
  });

app.get("/", (req, res) => res.send("hello express"));

app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

app.listen(8080, () => {
  console.log(`server started on port 8080`);
});

// mongodb+srv://jyotipm1999:jyotipm1999@assessment.r6xniqw.mongodb.net/?retryWrites=true&w=majority&appName=assessment

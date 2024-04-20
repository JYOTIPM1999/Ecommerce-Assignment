const express = require("express");
const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const Product = require("../modals/productModal");

const app = express.Router();
app.use(express.json());

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dehubjbqm",
  api_key: "727788418321428",
  api_secret: "ZfXJWMxjo0rsTmrPciKhNV82p3Y",
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/add", upload.single("image"), async (req, res) => {
  // try {
  const { name, details, price } = req.body;

  if (!req.file) {
    throw new Error("No file uploaded with `image` key.");
  }
  let stream = cloudinary.uploader.upload_stream(
    { resource_type: "raw" },
    async (error, result) => {
      if (error) {
        return res.status(500).send("Failed to upload image.");
      }

      try {
        // Create new product with the image URL
        const newProduct = await Product.create({
          name,
          image: result.secure_url,
          details,
          price,
        });

        res.status(201).json(newProduct);
      } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).send("Error adding product.");
      }
    }
  );
  stream.end(req.file.buffer);
});

app.get("/getProducts", async (req, res) => {
  try {
    let products = await Product.find();
    res.send(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// app.delete("/:productId", async (req, res) => {
//   try {
//     const productId = req.params.productId;

//     const product = await Product.findById(productId);

//     if (!product) {
//       return res.status(404).send("Product not found");
//     }

//     await Product.findByIdAndDelete(productId);
//     res.send("Product deleted successfully");
//   } catch (error) {
//     // console.error("Error deleting product:", error);
//     res.status(500).send("Internal server error");
//   }
// });

// app.post("/:productId", async (req, res) => {
//   try {
//     let newProduct = await Product.create(req.body);
//     res.send("New Product created");
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

module.exports = app;

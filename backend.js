const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

app.use(express.json());
app.use(cors());

main().catch((error) => console.log("Error: ", error));
async function main() {
  await mongoose.connect(
    "mongodb+srv://dbUser:BeU6AOOrzmR1C640@cluster0.fydlxqf.mongodb.net/?retryWrites=true&w=majority"
    );
}
const productSchema = mongoose.Schema({
  name: String,
  price: Number,
  imageSrc: String,
  amount: Number,
});
const Product = mongoose.model("Product", productSchema);
const orderSchema = mongoose.Schema({
  fullName: String,
  email: String,
  address: String,
  creditCardNumber: String,
  expiryDate: String,
  cvv: String,
  products: [{
    name: String,
    price: Number,
    imageSrc: String,
    amount: Number
  }]
});
const Order = mongoose.model("Order", orderSchema);

app.get("/product-manager/api/products", async (req, res) => {
  try {
    let products = await Product.find().lean();
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/product-manager/api", async (req, res) => {
  const { name, price, imageSrc, amount } = req.body;
  try {
    let newProduct = new Product({
      name: name,
      price: parseInt(price),
      imageSrc: imageSrc,
      amount: amount,
    });
    await newProduct.save();
  } catch (error) {
    console.log("Error: ", error);
  }
  res.send("Post successful");
});

app.get("/checkout/api/orders", async (req, res) => {
  try {
    let orders = await Order.find().lean();
    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
})

app.post("/checkout/api", async (req, res) => {
  const { fullName, email, address, creditCardNumber, expiryDate, cvv, products } =
    req.body;
  try {
    let newOrder = new Order({
      fullName: fullName,
      email: email,
      address: address,
      creditCardNumber: creditCardNumber,
      expiryDate: expiryDate,
      cvv: cvv,
      products: products
    });
    await newOrder.save()
  } catch (error) {
    console.log("Error: ", error);
  }
  res.send("Post successful");
});

app.listen(3000, () => {
  console.log("Server listening at port 3000");
});

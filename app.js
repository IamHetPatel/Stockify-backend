const express = require("express");
const app = express();
app.use(express.json());
const dotenv = require("dotenv");
const router = express.Router();
const cors = require("cors");
const port = 3000 || process.env.PORT;
require('dotenv').config({path: __dirname + '/.env'})

app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
const userRoutes = require("./user/userRoutes");
const productRoutes = require("./product/productRoutes");
const supplierRoutes = require("./supplier/supplierRoutes");
const orderRoutes = require("./order/orderRoutes");
const billRoutes = require("./billing/billRoutes");

require("./db/conn");

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/bills", billRoutes);

app.get("/", (req, res) => {
  res.send(console.log("working"));
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

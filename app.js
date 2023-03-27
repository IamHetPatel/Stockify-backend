const express = require("express");
const app = express();
app.use(express.json);
const dotenv = require("dotenv");
const cors = require("cors");


const userRoutes = require("./user/userRoutes");
const supplierRoutes = require("./supplier/supplierRoutes");
const productRoutes = require("./user/userRoutes");
const orderRoutes = require("./order/orderRoutes");
require("./db/conn");

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send(console.log("working"));
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

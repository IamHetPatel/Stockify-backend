
const productController = require("./productController");
const express = require("express");
const jwt_validation = require("./../auth/jwt_validation");
const app = express.Router();

app.get("/",jwt_validation.checkJwt, productController.getProductsList);
app.post("/",jwt_validation.checkJwt, productController.addProduct);
app.get(
  "/:name",jwt_validation.checkJwt,
  productController.searchProduct
);
app.delete("/delete/:id", productController.deleteProduct);
app.patch("/update-product",jwt_validation.checkJwt, productController.updateafter);

module.exports = app;
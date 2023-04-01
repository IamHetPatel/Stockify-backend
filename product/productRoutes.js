
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
app.patch("/update-product/:id",jwt_validation.checkJwt, productController.updateafter);

module.exports = app;
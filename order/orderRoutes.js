const express = require("express");
const router = express.Router();
const orderController = require("./orderController");


const jwt_validation = require("./../auth/jwt_validation");

// router.post("/", jwt_validation.checkJwt, orderController.addOrder);
router.get("/", jwt_validation.checkJwt, orderController.getOrdersList);
router.post("/", jwt_validation.checkJwt, orderController.addOrder);
router.patch("/", jwt_validation.checkJwt, orderController.updateOrderStatus);

module.exports = router;

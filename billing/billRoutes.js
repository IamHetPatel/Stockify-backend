const express = require("express");
const router = express.Router();
const billController = require("./billController");


const jwt_validation = require("./../auth/jwt_validation");

router.get("/", jwt_validation.checkJwt, billController.getBillsList);
// router.post("/", jwt_validation.checkJwt, billController.addBill);

module.exports = router;
